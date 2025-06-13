import { QueryRunner, SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Sale } from '../entities/Sale';
import { SaleProduct } from '../entities/SaleProduct';
import { Stock } from '../entities/Stock';
import { Customer } from '../entities/Customer';
import { Store } from '../entities/Store';
import { Employee } from '../entities/Employee';
import { Product } from '../entities/Product';
import { PaymentMethod } from '../entities/PaymentMethod';
import { CreateSaleDto } from '../dtos/CreateSaleDto';
import { CreateSaleProductDto } from '../dtos/CreateSaleProductDto';
import { UpdateSaleDto } from '../dtos/UpdateSaleDto';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { BaseService } from './base.service';
import { ApiFeatures } from '../utils/api-features';

export class SaleService extends BaseService<Sale> {
  public repo = AppDataSource.getRepository(Sale);

  constructor() {
    super({
      entity: Sale,
      entityName: 'sale',
      createDtoClass: CreateSaleDto,
      updateDtoClass: UpdateSaleDto,
      searchableFields: ['invoiceNumber', 'status'],
    });
  }

  // override create with transaction logic
  async create(dto: CreateSaleDto, currentUserId?: number): Promise<Sale> {
    const qr: QueryRunner = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const sale = new Sale();
      sale.saleDate = dto.saleDate;
      sale.subTotal = parseFloat(dto.subTotal);
      sale.discount = dto.discount ? parseFloat(dto.discount) : 0;
      sale.taxAmount = dto.taxAmount ? parseFloat(dto.taxAmount) : 0;
      sale.deliveryCharge = dto.deliveryCharge ? parseFloat(dto.deliveryCharge) : 0;
      sale.totalAmount = parseFloat(dto.totalAmount);
      sale.dueAmount = parseFloat(dto.dueAmount);
      sale.status = dto.status;
      sale.notes = dto.notes;
      sale.invoiceNumber = dto.invoiceNumber;
      sale.receiptOrAny = dto.receiptOrAny;
      sale.createdBy = currentUserId;

      if (dto.customer) {
        sale.customer = await qr.manager.findOneOrFail(Customer, { where: { id: dto.customer } });
      }
      if (dto.store) {
        sale.store = await qr.manager.findOneOrFail(Store, { where: { id: dto.store } });
      }
      if (dto.employee) {
        sale.employee = await qr.manager.findOneOrFail(Employee, { where: { id: dto.employee } });
      }
      if (dto.paymentMethod) {
        sale.paymentMethod = await qr.manager.findOneOrFail(PaymentMethod, { where: { id: dto.paymentMethod } });
      }

      const savedSale = await qr.manager.save(Sale, sale);

      const items = (dto as any).items as CreateSaleProductDto[] || [];
      for (const item of items) {
        // lock and fetch stock
        const stock = await qr.manager
          .createQueryBuilder(Stock, 'stock')
          .setLock('pessimistic_write')
          .where('stock.id = :id', { id: item.stock })
          .leftJoinAndSelect('stock.product', 'product')
          .getOne();

        if (!stock) throw new BadRequestError('Invalid stock');
        if (stock.product.id !== item.product) {
          throw new BadRequestError('Stock/product mismatch');
        }
        if (stock.quantity < item.quantity) {
          throw new BadRequestError(`Insufficient stock. Available: ${stock.quantity}, Required: ${item.quantity}`);
        }
        // reduce stock
        stock.quantity -= item.quantity;
        await qr.manager.save(Stock, stock);

        const sp = new SaleProduct();
        sp.sale = savedSale;
        sp.product = stock.product;
        sp.stock = stock;
        sp.quantity = item.quantity;
        sp.unitPrice = item.unitPrice;
        sp.totalPrice = item.totalPrice ?? item.quantity * item.unitPrice;
        sp.createdBy = currentUserId;
        await qr.manager.save(SaleProduct, sp);
      }

      await qr.commitTransaction();

      return await this.repo.findOneOrFail({
        where: { id: savedSale.id },
        relations: [
          'customer', 'store', 'employee',
          'items', 'items.product', 'items.stock',
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

  // override update with transaction logic
  async update(id: string, dto: UpdateSaleDto, currentUserId?: number): Promise<Sale> {
    const qr = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const sale = await qr.manager.findOne(Sale, {
        where: { id },
        relations: ['items', 'items.stock', 'items.product']
      });
      if (!sale) throw new NotFoundError('Sale not found');

      // reverse old items: restore stock
      for (const old of sale.items) {
        if (old.stock) {
          const st = await qr.manager
            .createQueryBuilder(Stock, 'stock')
            .setLock('pessimistic_write')
            .where('stock.id = :id', { id: old.stock.id })
            .getOne();
          if (st) {
            st.quantity += old.quantity;
            await qr.manager.save(Stock, st);
          }
        }
        await qr.manager.remove(SaleProduct, old);
      }

      // update scalar fields
      if (dto.saleDate) sale.saleDate = dto.saleDate;
      if (dto.subTotal) sale.subTotal = parseFloat(dto.subTotal);
      if (dto.discount !== undefined) sale.discount = dto.discount ? parseFloat(dto.discount) : 0;
      if (dto.taxAmount !== undefined) sale.taxAmount = dto.taxAmount ? parseFloat(dto.taxAmount) : 0;
      if (dto.deliveryCharge !== undefined) sale.deliveryCharge = dto.deliveryCharge ? parseFloat(dto.deliveryCharge) : 0;
      if (dto.totalAmount) sale.totalAmount = parseFloat(dto.totalAmount);
      if (dto.dueAmount) sale.dueAmount = parseFloat(dto.dueAmount);
      if (dto.status) sale.status = dto.status;
      if (dto.notes !== undefined) sale.notes = dto.notes;
      if (dto.invoiceNumber !== undefined) sale.invoiceNumber = dto.invoiceNumber;
      if (dto.receiptOrAny) sale.receiptOrAny = dto.receiptOrAny;
      sale.updatedBy = currentUserId;

      if (dto.customer) {
        sale.customer = await qr.manager.findOneOrFail(Customer, { where: { id: dto.customer } });
      }
      if (dto.store) {
        sale.store = await qr.manager.findOneOrFail(Store, { where: { id: dto.store } });
      }
      if (dto.employee) {
        sale.employee = await qr.manager.findOneOrFail(Employee, { where: { id: dto.employee } });
      }
      if (dto.paymentMethod !== undefined) {
        sale.paymentMethod = dto.paymentMethod
          ? await qr.manager.findOneOrFail(PaymentMethod, { where: { id: dto.paymentMethod } })
          : undefined;
      }

      const updatedSale = await qr.manager.save(Sale, sale);

      // add new items
      const items = (dto as any).items as CreateSaleProductDto[] || [];
      for (const item of items) {
        const stock = await qr.manager
          .createQueryBuilder(Stock, 'stock')
          .setLock('pessimistic_write')
          .where('stock.id = :id', { id: item.stock })
          .leftJoinAndSelect('stock.product', 'product')
          .getOne();

        if (!stock) throw new BadRequestError('Invalid stock');
        if (stock.product.id !== item.product) {
          throw new BadRequestError('Stock/product mismatch');
        }
        if (stock.quantity < item.quantity) {
          throw new BadRequestError(`Insufficient stock. Available: ${stock.quantity}, Required: ${item.quantity}`);
        }
        stock.quantity -= item.quantity;
        await qr.manager.save(Stock, stock);

        const sp = new SaleProduct();
        sp.sale = updatedSale;
        sp.product = stock.product;
        sp.stock = stock;
        sp.quantity = item.quantity;
        sp.unitPrice = item.unitPrice;
        sp.totalPrice = item.totalPrice ?? item.quantity * item.unitPrice;
        sp.updatedBy = currentUserId;
        await qr.manager.save(SaleProduct, sp);
      }

      await qr.commitTransaction();

      return await this.repo.findOneOrFail({
        where: { id: updatedSale.id },
        relations: [
          'customer', 'store', 'employee',
          'items', 'items.product', 'items.stock',
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

  // override softDelete: restore stock and soft-remove
  async softDelete(id: string, currentUserId?: number): Promise<any> {
    const qr = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const sale = await qr.manager.findOne(Sale, {
        where: { id },
        relations: ['items', 'items.stock']
      });
      if (!sale) throw new NotFoundError('Sale not found');

      for (const it of sale.items) {
        if (it.stock) {
          const st = await qr.manager
            .createQueryBuilder(Stock, 'stock')
            .setLock('pessimistic_write')
            .where('stock.id = :id', { id: it.stock.id })
            .getOne();
          if (st) {
            // restore stock quantity
            st.quantity += it.quantity;
            await qr.manager.save(Stock, st);
          }
        }
        await qr.manager.softRemove(SaleProduct, it);
      }
      await qr.manager.softRemove(Sale, sale);
      await qr.commitTransaction();
      return { deleted: true };
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  // override restore: decrement stock again, then recover
  async restore(id: string, currentUserId?: number): Promise<any> {
    const qr = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const sale = await qr.manager.findOne(Sale, {
        where: { id },
        withDeleted: true,
        relations: ['items', 'items.stock'],
      });
      if (!sale) throw new NotFoundError('Sale not found');
      if (!sale.deletedAt) throw new BadRequestError('Sale is not deleted');

      for (const it of sale.items) {
        if (it.stock) {
          const st = await qr.manager
            .createQueryBuilder(Stock, 's')
            .setLock('pessimistic_write')
            .where('s.id = :id', { id: it.stock.id })
            .getOne();
          if (!st) throw new BadRequestError('Stock row missing on restore');
          // check if enough stock to decrement again
          if (st.quantity < it.quantity) {
            throw new BadRequestError(
              `Insufficient stock to restore sale item ${it.id}. Available: ${st.quantity}, Required: ${it.quantity}`
            );
          }
          st.quantity -= it.quantity;
          await qr.manager.save(Stock, st);
        }
      }

      await qr.manager.recover(SaleProduct, sale.items.map(i => ({ id: i.id })));
      await qr.manager.recover(Sale, sale);

      await qr.commitTransaction();
      return { restored: true };
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  // override hardDelete: if not soft-deleted, restore stock then delete
  async hardDelete(id: string, currentUserId?: number): Promise<any> {
    const qr = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const sale = await qr.manager.findOne(Sale, {
        where: { id },
        withDeleted: true,
        relations: ['items', 'items.stock']
      });
      if (!sale) throw new NotFoundError('Sale not found');

      if (!sale.deletedAt) {
        // reverse stock once more
        for (const it of sale.items) {
          if (it.stock) {
            const st = await qr.manager.findOne(Stock, { where: { id: it.stock.id } });
            if (st) {
              st.quantity += it.quantity;
              await qr.manager.save(Stock, st);
            }
          }
        }
      }
      // delete children then sale
      for (const it of sale.items) {
        await qr.manager.delete(SaleProduct, it.id);
      }
      await qr.manager.delete(Sale, id);

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
  async findAll(queryParams: any): Promise<{ data: Sale[]; pagination: { page: number; limit: number; total: number } }> {
    let qb: SelectQueryBuilder<Sale> = this.repo.createQueryBuilder('sale')
      .leftJoinAndSelect('sale.customer', 'customer')
      .leftJoinAndSelect('sale.store', 'store')
      .leftJoinAndSelect('sale.employee', 'employee')
      .leftJoinAndSelect('sale.items', 'items')
      .leftJoinAndSelect('items.product', 'itemProduct')
      .leftJoinAndSelect('items.stock', 'itemStock')
      .leftJoinAndSelect('sale.paymentMethod', 'paymentMethod');
    const includeDeleted = queryParams.includeDeleted === 'true' || queryParams.includeDeleted === true;
    if (includeDeleted) qb = qb.withDeleted();
    const total = await qb.getCount();
    const features = new ApiFeatures<Sale>(qb, queryParams, this.searchableFields)
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
  async softDeleteMany(ids: Array<string | number>, currentUserId?: number): Promise<any> {
    if (!Array.isArray(ids) || ids.length === 0) throw Object.assign(new Error('No IDs provided'), { status: 400 });
    for (const id of ids) {
      await this.softDelete(String(id), currentUserId);
    }
    return { deleted: true, count: ids.length };
  }

  async restoreMany(ids: Array<string | number>, currentUserId?: number): Promise<any> {
    if (!Array.isArray(ids) || ids.length === 0) throw Object.assign(new Error('No IDs provided'), { status: 400 });
    for (const id of ids) {
      await this.restore(String(id), currentUserId);
    }
    return { restored: true, count: ids.length };
  }

  async hardDeleteMany(ids: Array<string | number>, currentUserId?: number): Promise<any> {
    if (!Array.isArray(ids) || ids.length === 0) throw Object.assign(new Error('No IDs provided'), { status: 400 });
    for (const id of ids) {
      await this.hardDelete(String(id), currentUserId);
    }
    return { deleted: true, count: ids.length };
  }
}
