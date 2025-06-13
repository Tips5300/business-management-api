// src/services/purchase.service.ts
import { QueryRunner, SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Purchase } from '../entities/Purchase';
import { PurchaseProduct } from '../entities/PurchaseProduct';
import { Stock } from '../entities/Stock';
import { Supplier } from '../entities/Supplier';
import { Store } from '../entities/Store';
import { Employee } from '../entities/Employee';
import { Batch } from '../entities/Batch';
import { Product } from '../entities/Product';
import { PaymentMethod } from '../entities/PaymentMethod';
import { CreatePurchaseDto } from '../dtos/CreatePurchaseDto';
import { CreatePurchaseProductDto } from '../dtos/CreatePurchaseProductDto';
import { UpdatePurchaseDto } from '../dtos/UpdatePurchaseDto';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { BaseService } from './base.service';
import { ApiFeatures } from '../utils/api-features';

export class PurchaseService extends BaseService<Purchase> {
  public repo = AppDataSource.getRepository(Purchase);

  constructor() {
    super({
      entity: Purchase,
      entityName: 'purchase',
      createDtoClass: CreatePurchaseDto,
      updateDtoClass: UpdatePurchaseDto,
      searchableFields: ['invoiceNumber', 'status'],
    });
  }

  // override create with custom transaction logic
  async create(dto: CreatePurchaseDto, currentUserId?: number): Promise<Purchase> {
    const qr: QueryRunner = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const p = new Purchase();
      p.purchaseDate = dto.purchaseDate;
      p.subTotal = parseFloat(dto.subTotal);
      p.discount = dto.discount ? parseFloat(dto.discount) : 0;
      p.taxAmount = dto.taxAmount ? parseFloat(dto.taxAmount) : 0;
      p.shippingCharge = dto.shippingCharge ? parseFloat(dto.shippingCharge) : 0;
      p.totalAmount = parseFloat(dto.totalAmount);
      p.dueAmount = parseFloat(dto.dueAmount);
      p.status = dto.status;
      p.notes = dto.notes;
      p.invoiceNumber = dto.invoiceNumber;
      p.receiptOrAny = dto.receiptOrAny;
      p.createdBy = currentUserId;

      if (dto.supplier) {
        p.supplier = await qr.manager.findOneOrFail(Supplier, { where: { id: dto.supplier } });
      }
      if (dto.store) {
        p.store = await qr.manager.findOneOrFail(Store, { where: { id: dto.store } });
      }
      if (dto.employee) {
        p.employee = await qr.manager.findOneOrFail(Employee, { where: { id: dto.employee } });
      }
      if (dto.paymentMethod) {
        p.paymentMethod = await qr.manager.findOneOrFail(PaymentMethod, { where: { id: dto.paymentMethod } });
      }
      const saved = await qr.manager.save(Purchase, p);

      const items = (dto as any).items as CreatePurchaseProductDto[] || [];
      for (const item of items) {
        const product = await qr.manager.findOne(Product, { where: { id: item.product } });
        if (!product) throw new BadRequestError('Invalid product');
        let batch: Batch | undefined;
        if (item.batch) {
          const found = await qr.manager.findOne(Batch, { where: { id: item.batch } });
          if (!found) throw new BadRequestError('Invalid batch');
          batch = found;
        }
        const pp = new PurchaseProduct();
        pp.purchase = saved;
        pp.product = product;
        pp.batch = batch;
        pp.quantity = item.quantity;
        pp.unitCost = item.unitCost;
        pp.totalCost = item.totalCost ?? item.quantity * item.unitCost;
        pp.createdBy = currentUserId;

        let stock = await qr.manager
          .createQueryBuilder(Stock, 's')
          .setLock('pessimistic_write')
          .where('s.productId = :productId', { productId: product.id })
          .andWhere(batch ? 's.batchId = :batchId' : 's.batchId IS NULL',
            batch ? { batchId: batch.id } : {})
          .getOne();

        if (stock) {
          stock.quantity += item.quantity;
          stock.unitCost = item.unitCost;
        } else {
          stock = new Stock();
          stock.product = product;
          stock.batch = batch;
          stock.quantity = item.quantity;
          stock.unitCost = item.unitCost;
          stock.createdBy = currentUserId;
        }
        const savedStock = await qr.manager.save(Stock, stock);
        pp.stock = savedStock;
        await qr.manager.save(PurchaseProduct, pp);
      }

      await qr.commitTransaction();
      return await this.repo.findOneOrFail({
        where: { id: saved.id },
        relations: [
          'supplier', 'store', 'employee',
          'items', 'items.product', 'items.batch', 'items.stock',
          'paymentMethod'
        ],
      });
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  // override update with custom logic
  async update(id: string, dto: UpdatePurchaseDto, currentUserId?: number): Promise<Purchase> {
    const qr = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const existing = await qr.manager.findOne(Purchase, {
        where: { id },
        relations: ['items', 'items.stock', 'items.batch', 'items.product'],
      });
      if (!existing) throw new NotFoundError('Purchase not found');

      // reverse old items
      for (const old of existing.items) {
        if (old.stock) {
          const st = await qr.manager
            .createQueryBuilder(Stock, 's')
            .setLock('pessimistic_write')
            .where('s.id = :id', { id: old.stock.id })
            .getOne();
          if (st) {
            st.quantity = Math.max(0, st.quantity - old.quantity);
            await qr.manager.save(Stock, st);
          }
        }
        await qr.manager.remove(PurchaseProduct, old);
      }

      // update fields
      if (dto.purchaseDate) existing.purchaseDate = dto.purchaseDate;
      if (dto.subTotal) existing.subTotal = parseFloat(dto.subTotal);
      if (dto.discount !== undefined) existing.discount = dto.discount ? parseFloat(dto.discount) : 0;
      if (dto.taxAmount !== undefined) existing.taxAmount = dto.taxAmount ? parseFloat(dto.taxAmount) : 0;
      if (dto.shippingCharge !== undefined) existing.shippingCharge = dto.shippingCharge ? parseFloat(dto.shippingCharge) : 0;
      if (dto.totalAmount) existing.totalAmount = parseFloat(dto.totalAmount);
      if (dto.dueAmount) existing.dueAmount = parseFloat(dto.dueAmount);
      if (dto.status) existing.status = dto.status;
      if (dto.notes !== undefined) existing.notes = dto.notes;
      if (dto.invoiceNumber !== undefined) existing.invoiceNumber = dto.invoiceNumber;
      if (dto.receiptOrAny) existing.receiptOrAny = dto.receiptOrAny;
      existing.updatedBy = currentUserId;

      if (dto.supplier) {
        existing.supplier = await qr.manager.findOneOrFail(Supplier, { where: { id: dto.supplier } });
      }
      if (dto.store) {
        existing.store = await qr.manager.findOneOrFail(Store, { where: { id: dto.store } });
      }
      if (dto.employee) {
        existing.employee = await qr.manager.findOneOrFail(Employee, { where: { id: dto.employee } });
      }
      if (dto.paymentMethod !== undefined) {
        existing.paymentMethod = dto.paymentMethod
          ? await qr.manager.findOneOrFail(PaymentMethod, { where: { id: dto.paymentMethod } })
          : undefined;
      }

      const saved = await qr.manager.save(Purchase, existing);

      const items = (dto as any).items as CreatePurchaseProductDto[] || [];
      for (const item of items) {
        const product = await qr.manager.findOne(Product, { where: { id: item.product } });
        if (!product) throw new BadRequestError('Invalid product');
        let batch: Batch | undefined;
        if (item.batch) {
          const found = await qr.manager.findOne(Batch, { where: { id: item.batch } });
          if (!found) throw new BadRequestError('Invalid batch');
          batch = found;
        }
        const pp = new PurchaseProduct();
        pp.purchase = saved;
        pp.product = product;
        pp.batch = batch;
        pp.quantity = item.quantity;
        pp.unitCost = item.unitCost;
        pp.totalCost = item.totalCost ?? item.quantity * item.unitCost;
        pp.updatedBy = currentUserId;

        let stock = await qr.manager
          .createQueryBuilder(Stock, 's')
          .setLock('pessimistic_write')
          .where('s.productId = :productId', { productId: product.id })
          .andWhere(batch ? 's.batchId = :batchId' : 's.batchId IS NULL',
            batch ? { batchId: batch.id } : {})
          .getOne();

        if (stock) {
          stock.quantity += item.quantity;
          stock.unitCost = item.unitCost;
        } else {
          stock = new Stock();
          stock.product = product;
          stock.batch = batch;
          stock.quantity = item.quantity;
          stock.unitCost = item.unitCost;
          stock.createdBy = currentUserId;
        }
        const savedStock = await qr.manager.save(Stock, stock);
        pp.stock = savedStock;
        await qr.manager.save(PurchaseProduct, pp);
      }

      await qr.commitTransaction();
      return await this.repo.findOneOrFail({
        where: { id: saved.id },
        relations: [
          'supplier', 'store', 'employee',
          'items', 'items.product', 'items.batch', 'items.stock',
          'paymentMethod'
        ],
      });
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  // override softDelete with custom stock reversal
  async softDelete(id: string, currentUserId?: number): Promise<{ deleted: boolean }> {
    const qr = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const purchase = await qr.manager.findOne(Purchase, {
        where: { id },
        relations: ['items', 'items.stock']
      });
      if (!purchase) throw new NotFoundError('Purchase not found');
      for (const it of purchase.items) {
        if (it.stock) {
          const st = await qr.manager
            .createQueryBuilder(Stock, 's')
            .setLock('pessimistic_write')
            .where('s.id = :id', { id: it.stock.id })
            .getOne();
          if (st) {
            st.quantity = Math.max(0, st.quantity - it.quantity);
            await qr.manager.save(Stock, st);
          }
        }
        await qr.manager.softRemove(PurchaseProduct, it);
      }
      await qr.manager.softRemove(Purchase, purchase);
      await qr.commitTransaction();
      return { deleted: true };
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  async restore(id: string, currentUserId?: number): Promise<{ restored: boolean }> {
    const qr = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const purchase = await qr.manager.findOne(Purchase, {
        where: { id },
        withDeleted: true,
        relations: ['items', 'items.stock'],
      });
      if (!purchase) throw new NotFoundError('Purchase not found');
      if (!purchase.deletedAt) throw new BadRequestError('Purchase is not deleted');
      for (const it of purchase.items) {
        if (it.stock) {
          const st = await qr.manager
            .createQueryBuilder(Stock, 's')
            .setLock('pessimistic_write')
            .where('s.id = :id', { id: it.stock.id })
            .getOne();
          if (st) {
            st.quantity += it.quantity;
            await qr.manager.save(Stock, st);
          } else {
            throw new BadRequestError('Missing stock row on restore');
          }
        }
      }
      await qr.manager.recover(PurchaseProduct, purchase.items.map(i => ({ id: i.id })));
      await qr.manager.recover(Purchase, purchase);
      await qr.commitTransaction();
      return { restored: true };
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  async hardDelete(id: string, currentUserId?: number): Promise<{ deleted: boolean }> {
    const qr = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const purchase = await qr.manager.findOne(Purchase, {
        where: { id },
        withDeleted: true,
        relations: ['items', 'items.stock']
      });
      if (!purchase) throw new NotFoundError('Purchase not found');
      if (!purchase.deletedAt) {
        for (const it of purchase.items) {
          if (it.stock) {
            const st = await qr.manager.findOne(Stock, { where: { id: it.stock.id } });
            if (st) {
              st.quantity = Math.max(0, st.quantity - it.quantity);
              await qr.manager.save(Stock, st);
            }
          }
        }
      }
      for (const it of purchase.items) {
        await qr.manager.delete(PurchaseProduct, it.id);
      }
      await qr.manager.delete(Purchase, id);
      await qr.commitTransaction();
      return { deleted: true };
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  // generic findAll with pagination/sort/search/filter, including relations
  async findAll(queryParams: any): Promise<{ data: Purchase[]; pagination: { page: number; limit: number; total: number } }> {
    let qb: SelectQueryBuilder<Purchase> = this.repo.createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.supplier', 'supplier')
      .leftJoinAndSelect('purchase.store', 'store')
      .leftJoinAndSelect('purchase.employee', 'employee')
      .leftJoinAndSelect('purchase.items', 'items')
      .leftJoinAndSelect('items.product', 'itemProduct')
      .leftJoinAndSelect('items.batch', 'itemBatch')
      .leftJoinAndSelect('items.stock', 'itemStock')
      .leftJoinAndSelect('purchase.paymentMethod', 'paymentMethod');
    const includeDeleted = queryParams.includeDeleted === 'true' || queryParams.includeDeleted === true;
    if (includeDeleted) {
      qb = qb.withDeleted();
    }
    const total = await qb.getCount();
    const features = new ApiFeatures<Purchase>(qb, queryParams, this.searchableFields)
      .search()
      .filter()
      .sort()
      .paginate();
    const data = await features.getQueryBuilder().getMany();
    const page = parseInt(queryParams.page as string, 10) || 1;
    const limit = parseInt(queryParams.limit as string, 10) || 25;
    return { data, pagination: { page, limit, total } };
  }

  // bulk operations: using custom softDelete / restore / hardDelete logic
  async softDeleteMany(ids: Array<string | number>, currentUserId?: number): Promise<void> {
    if (!Array.isArray(ids) || ids.length === 0) throw Object.assign(new Error('No IDs provided'), { status: 400 });
    const qr = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      for (const id of ids) {
        await this.softDelete(String(id), currentUserId);
      }
      await qr.commitTransaction();
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  async restoreMany(ids: Array<string | number>, currentUserId?: number): Promise<void> {
    if (!Array.isArray(ids) || ids.length === 0) throw Object.assign(new Error('No IDs provided'), { status: 400 });
    const qr = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      for (const id of ids) {
        await this.restore(String(id), currentUserId);
      }
      await qr.commitTransaction();
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  async hardDeleteMany(ids: Array<string | number>, currentUserId?: number): Promise<void> {
    if (!Array.isArray(ids) || ids.length === 0) throw Object.assign(new Error('No IDs provided'), { status: 400 });
    const qr = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      for (const id of ids) {
        await this.hardDelete(String(id), currentUserId);
      }
      await qr.commitTransaction();
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }
}
