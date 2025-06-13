// src/services/purchase-return.service.ts
import { QueryRunner, SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../config/database';
import { PurchaseReturn } from '../entities/PurchaseReturn';
import { PurchaseReturnProduct } from '../entities/PurchaseReturnProduct';
import { Purchase } from '../entities/Purchase';
import { Stock } from '../entities/Stock';
import { Product } from '../entities/Product';
import { PaymentMethod } from '../entities/PaymentMethod';
import { CreatePurchaseReturnDto } from '../dtos/CreatePurchaseReturnDto';
import { CreatePurchaseReturnProductDto } from '../dtos/CreatePurchaseReturnProductDto';
import { UpdatePurchaseReturnDto } from '../dtos/UpdatePurchaseReturnDto';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { BaseService } from './base.service';
import { ApiFeatures } from '../utils/api-features';

export class PurchaseReturnService extends BaseService<PurchaseReturn> {
  public repo = AppDataSource.getRepository(PurchaseReturn);

  constructor() {
    super({
      entity: PurchaseReturn,
      entityName: 'purchaseReturn',
      createDtoClass: CreatePurchaseReturnDto,
      updateDtoClass: UpdatePurchaseReturnDto,
      searchableFields: ['returnDate'], // if needed
    });
  }

  // override create with transaction logic
  async create(dto: CreatePurchaseReturnDto, userId?: number): Promise<PurchaseReturn> {
    const qr: QueryRunner = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      // 1. Validate purchase
      const purchase = await qr.manager.findOne(Purchase, {
        where: { id: dto.purchase },
        relations: ['items', 'items.stock', 'items.product'],
      });
      if (!purchase) throw new BadRequestError('Invalid purchase');

      // 2. Create PurchaseReturn
      const pr = new PurchaseReturn();
      pr.returnDate = dto.returnDate;
      pr.totalReturnAmount = dto.totalReturnAmount ?? 0;
      pr.purchase = purchase;
      if (dto.paymentMethod) {
        pr.paymentMethod = await qr.manager.findOneOrFail(PaymentMethod, { where: { id: dto.paymentMethod } });
      }
      pr.createdBy = userId;
      const saved = await qr.manager.save(PurchaseReturn, pr);

      // 3. Process items: increase stock
      const items = (dto.items || []) as CreatePurchaseReturnProductDto[];
      for (const item of items) {
        // Validate product
        const product = await qr.manager.findOne(Product, { where: { id: item.productId } });
        if (!product) throw new BadRequestError('Invalid product');

        // Find or create stock entry
        let stock: Stock | null = null;
        if (item.stock) {
          stock = await qr.manager
            .createQueryBuilder(Stock, 's')
            .setLock('pessimistic_write')
            .where('s.id = :id', { id: item.stock })
            .getOne();
        } else {
          stock = await qr.manager
            .createQueryBuilder(Stock, 's')
            .setLock('pessimistic_write')
            .where('s.productId = :productId', { productId: item.productId })
            .getOne();
        }
        if (!stock) {
          stock = new Stock();
          stock.product = product;
          stock.quantity = item.quantity;
          stock.unitCost = item.unitPrice;
          stock.createdBy = userId;
          stock = await qr.manager.save(Stock, stock);
        } else {
          stock.quantity += item.quantity;
          await qr.manager.save(Stock, stock);
        }

        // Create return product entry
        const rp = new PurchaseReturnProduct();
        rp.purchaseReturn = saved;
        rp.product = product;
        rp.quantity = item.quantity;
        rp.unitPrice = item.unitPrice;
        rp.totalPrice = item.totalPrice ?? item.quantity * item.unitPrice;
        rp.stock = stock;
        rp.createdBy = userId;
        await qr.manager.save(PurchaseReturnProduct, rp);
      }

      await qr.commitTransaction();

      return await this.repo.findOneOrFail({
        where: { id: saved.id },
        relations: [
          'purchase',
          'items',
          'items.product',
          'items.stock',
          'paymentMethod',
        ],
      });
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  // override update with transaction logic
  async update(id: string, dto: UpdatePurchaseReturnDto, userId?: number): Promise<PurchaseReturn> {
    const qr: QueryRunner = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const pr = await qr.manager.findOne(PurchaseReturn, {
        where: { id },
        relations: ['items', 'items.product', 'items.stock'],
      });
      if (!pr) throw new NotFoundError('PurchaseReturn not found');

      // Reverse old items: decrease stock back
      for (const old of pr.items) {
        if (old.stock) {
          const stock = await qr.manager
            .createQueryBuilder(Stock, 's')
            .setLock('pessimistic_write')
            .where('s.id = :id', { id: old.stock.id })
            .getOne();
          if (stock) {
            stock.quantity = Math.max(0, stock.quantity - old.quantity);
            await qr.manager.save(Stock, stock);
          }
        }
        await qr.manager.remove(PurchaseReturnProduct, old);
      }

      // Update scalar fields
      if (dto.returnDate) pr.returnDate = dto.returnDate;
      if (dto.totalReturnAmount !== undefined) pr.totalReturnAmount = dto.totalReturnAmount;
      if (dto.paymentMethod !== undefined) {
        pr.paymentMethod = dto.paymentMethod
          ? await qr.manager.findOneOrFail(PaymentMethod, { where: { id: dto.paymentMethod } })
          : undefined;
      }
      pr.updatedBy = userId;

      // Update purchase if changed
      if (dto.purchase) {
        pr.purchase = await qr.manager.findOneOrFail(Purchase, { where: { id: dto.purchase } });
      }

      const saved = await qr.manager.save(PurchaseReturn, pr);

      // Apply new items: increase stock
      const items = (dto.items || []) as CreatePurchaseReturnProductDto[];
      for (const item of items) {
        const product = await qr.manager.findOne(Product, { where: { id: item.productId } });
        if (!product) throw new BadRequestError('Invalid product');

        let stock: Stock | null = null;
        if (item.stock) {
          stock = await qr.manager
            .createQueryBuilder(Stock, 's')
            .setLock('pessimistic_write')
            .where('s.id = :id', { id: item.stock })
            .getOne();
        } else {
          stock = await qr.manager
            .createQueryBuilder(Stock, 's')
            .setLock('pessimistic_write')
            .where('s.productId = :productId', { productId: item.productId })
            .getOne();
        }
        if (!stock) {
          stock = new Stock();
          stock.product = product;
          stock.quantity = item.quantity;
          stock.unitCost = item.unitPrice;
          stock.createdBy = userId;
          stock = await qr.manager.save(Stock, stock);
        } else {
          stock.quantity += item.quantity;
          await qr.manager.save(Stock, stock);
        }

        const rp = new PurchaseReturnProduct();
        rp.purchaseReturn = saved;
        rp.product = product;
        rp.quantity = item.quantity;
        rp.unitPrice = item.unitPrice;
        rp.totalPrice = item.totalPrice ?? item.quantity * item.unitPrice;
        rp.stock = stock;
        rp.updatedBy = userId;
        await qr.manager.save(PurchaseReturnProduct, rp);
      }

      await qr.commitTransaction();

      return await this.repo.findOneOrFail({
        where: { id: saved.id },
        relations: [
          'purchase',
          'items',
          'items.product',
          'items.stock',
          'paymentMethod',
        ],
      });
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  // override softDelete: reverse stock changes, soft-remove
  async softDelete(id: string, userId?: number): Promise<any> {
    const qr: QueryRunner = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const pr = await qr.manager.findOne(PurchaseReturn, {
        where: { id },
        relations: ['items', 'items.stock'],
      });
      if (!pr) throw new NotFoundError('PurchaseReturn not found');

      for (const it of pr.items) {
        if (it.stock) {
          const stock = await qr.manager
            .createQueryBuilder(Stock, 's')
            .setLock('pessimistic_write')
            .where('s.id = :id', { id: it.stock.id })
            .getOne();
          if (stock) {
            stock.quantity = Math.max(0, stock.quantity - it.quantity);
            await qr.manager.save(Stock, stock);
          }
        }
        await qr.manager.softRemove(PurchaseReturnProduct, it);
      }
      await qr.manager.softRemove(PurchaseReturn, pr);
      await qr.commitTransaction();
      return { deleted: true };
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  // override restore: re-apply stock increment, recover
  async restore(id: string, userId?: number): Promise<any> {
    const qr: QueryRunner = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const pr = await qr.manager.findOne(PurchaseReturn, {
        where: { id },
        withDeleted: true,
        relations: ['items', 'items.stock'],
      });
      if (!pr) throw new NotFoundError('PurchaseReturn not found');
      if (!pr.deletedAt) throw new BadRequestError('PurchaseReturn is not deleted');

      for (const it of pr.items) {
        if (it.stock) {
          const st = await qr.manager
            .createQueryBuilder(Stock, 's')
            .setLock('pessimistic_write')
            .where('s.id = :id', { id: it.stock.id })
            .getOne();
          if (st) {
            st.quantity += it.quantity;
            await qr.manager.save(Stock, st);
          }
        }
      }
      await qr.manager.recover(PurchaseReturnProduct, pr.items.map(i => ({ id: i.id })));
      await qr.manager.recover(PurchaseReturn, pr);
      await qr.commitTransaction();
      return { restored: true };
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  // override hardDelete: if not soft-deleted, reverse stock then delete
  async hardDelete(id: string, userId?: number): Promise<any> {
    const qr: QueryRunner = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const pr = await qr.manager.findOne(PurchaseReturn, {
        where: { id },
        withDeleted: true,
        relations: ['items', 'items.stock'],
      });
      if (!pr) throw new NotFoundError('PurchaseReturn not found');

      if (!pr.deletedAt) {
        for (const it of pr.items) {
          if (it.stock) {
            const stock = await qr.manager.findOne(Stock, { where: { id: it.stock.id } });
            if (stock) {
              stock.quantity = Math.max(0, stock.quantity - it.quantity);
              await qr.manager.save(Stock, stock);
            }
          }
        }
      }
      for (const it of pr.items) {
        await qr.manager.delete(PurchaseReturnProduct, it.id);
      }
      await qr.manager.delete(PurchaseReturn, id);
      await qr.commitTransaction();
      return { deleted: true };
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  // override findAll to include relations + ApiFeatures
  async findAll(queryParams: any): Promise<{ data: PurchaseReturn[]; pagination: { page: number; limit: number; total: number } }> {
    let qb: SelectQueryBuilder<PurchaseReturn> = this.repo.createQueryBuilder('purchaseReturn')
      .leftJoinAndSelect('purchaseReturn.purchase', 'purchase')
      .leftJoinAndSelect('purchaseReturn.items', 'items')
      .leftJoinAndSelect('items.product', 'itemProduct')
      .leftJoinAndSelect('items.stock', 'itemStock')
      .leftJoinAndSelect('purchaseReturn.paymentMethod', 'paymentMethod');
    const includeDeleted = queryParams.includeDeleted === 'true' || queryParams.includeDeleted === true;
    if (includeDeleted) qb = qb.withDeleted();
    const total = await qb.getCount();
    const features = new ApiFeatures<PurchaseReturn>(qb, queryParams, this.searchableFields)
      .search()
      .filter()
      .sort()
      .paginate();
    const data = await features.getQueryBuilder().getMany();
    const page = parseInt(queryParams.page as string, 10) || 1;
    const limit = parseInt(queryParams.limit as string, 10) || 25;
    return { data, pagination: { page, limit, total } };
  }

  // bulk operations
  async softDeleteMany(ids: Array<string | number>, userId?: number): Promise<any> {
    if (!Array.isArray(ids) || ids.length === 0) throw Object.assign(new Error('No IDs provided'), { status: 400 });
    for (const id of ids) {
      await this.softDelete(String(id), userId);
    }
    return { deleted: true, count: ids.length };
  }

  async restoreMany(ids: Array<string | number>, userId?: number): Promise<any> {
    if (!Array.isArray(ids) || ids.length === 0) throw Object.assign(new Error('No IDs provided'), { status: 400 });
    for (const id of ids) {
      await this.restore(String(id), userId);
    }
    return { restored: true, count: ids.length };
  }

  async hardDeleteMany(ids: Array<string | number>, userId?: number): Promise<any> {
    if (!Array.isArray(ids) || ids.length === 0) throw Object.assign(new Error('No IDs provided'), { status: 400 });
    for (const id of ids) {
      await this.hardDelete(String(id), userId);
    }
    return { deleted: true, count: ids.length };
  }
}
