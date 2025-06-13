// src/services/sale-return.service.ts
import { QueryRunner, SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../config/database';
import { SaleReturn } from '../entities/SaleReturn';
import { SaleReturnProduct } from '../entities/SaleReturnProduct';
import { Sale } from '../entities/Sale';
import { Stock } from '../entities/Stock';
import { Product } from '../entities/Product';
import { PaymentMethod } from '../entities/PaymentMethod';
import { CreateSaleReturnDto } from '../dtos/CreateSaleReturnDto';
import { CreateSaleReturnProductDto } from '../dtos/CreateSaleReturnProductDto';
import { UpdateSaleReturnDto } from '../dtos/UpdateSaleReturnDto';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { BaseService } from './base.service';
import { ApiFeatures } from '../utils/api-features';

export class SaleReturnService extends BaseService<SaleReturn> {
  public repo = AppDataSource.getRepository(SaleReturn);

  constructor() {
    super({
      entity: SaleReturn,
      entityName: 'saleReturn',
      createDtoClass: CreateSaleReturnDto,
      updateDtoClass: UpdateSaleReturnDto,
      searchableFields: ['returnDate'],
    });
  }

  async create(dto: CreateSaleReturnDto, userId?: number): Promise<SaleReturn> {
    const qr: QueryRunner = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      // Validate sale
      const sale = await qr.manager.findOne(Sale, {
        where: { id: dto.sale },
        relations: ['items', 'items.stock', 'items.product'],
      });
      if (!sale) throw new BadRequestError('Invalid sale');

      // Create SaleReturn
      const sr = new SaleReturn();
      sr.returnDate = dto.returnDate;
      sr.totalReturnAmount = dto.totalReturnAmount ?? 0;
      sr.sale = sale;
      if (dto.paymentMethod) {
        sr.paymentMethod = await qr.manager.findOneOrFail(PaymentMethod, { where: { id: dto.paymentMethod } });
      }
      sr.createdBy = userId;
      const saved = await qr.manager.save(SaleReturn, sr);

      // Process items: increase stock back
      const items = (dto.items || []) as CreateSaleReturnProductDto[];
      for (const item of items) {
        const product = await qr.manager.findOne(Product, { where: { id: item.product } });
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
            .where('s.productId = :productId', { productId: item.product })
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

        const rp = new SaleReturnProduct();
        rp.saleReturn = saved;
        rp.product = product;
        rp.quantity = item.quantity;
        rp.unitPrice = item.unitPrice;
        rp.totalPrice = item.totalPrice ?? item.quantity * item.unitPrice;
        rp.stock = stock;
        rp.createdBy = userId;
        await qr.manager.save(SaleReturnProduct, rp);
      }

      await qr.commitTransaction();

      return await this.repo.findOneOrFail({
        where: { id: saved.id },
        relations: [
          'sale',
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

  async update(id: string, dto: UpdateSaleReturnDto, userId?: number): Promise<SaleReturn> {
    const qr: QueryRunner = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const sr = await qr.manager.findOne(SaleReturn, {
        where: { id },
        relations: ['items', 'items.product', 'items.stock'],
      });
      if (!sr) throw new NotFoundError('SaleReturn not found');

      // Reverse old items: decrease stock
      for (const old of sr.items) {
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
        await qr.manager.remove(SaleReturnProduct, old);
      }

      // Update scalar fields
      if (dto.returnDate) sr.returnDate = dto.returnDate;
      if (dto.totalReturnAmount !== undefined) sr.totalReturnAmount = dto.totalReturnAmount;
      if (dto.paymentMethod !== undefined) {
        sr.paymentMethod = dto.paymentMethod
          ? await qr.manager.findOneOrFail(PaymentMethod, { where: { id: dto.paymentMethod } })
          : undefined;
      }
      sr.updatedBy = userId;

      // Update sale relation if changed
      if (dto.sale) {
        sr.sale = await qr.manager.findOneOrFail(Sale, { where: { id: dto.sale } });
      }

      const saved = await qr.manager.save(SaleReturn, sr);

      // Add new items
      const items = (dto.items || []) as CreateSaleReturnProductDto[];
      for (const item of items) {
        const product = await qr.manager.findOne(Product, { where: { id: item.product } });
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
            .where('s.productId = :productId', { productId: item.product })
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

        const rp = new SaleReturnProduct();
        rp.saleReturn = saved;
        rp.product = product;
        rp.quantity = item.quantity;
        rp.unitPrice = item.unitPrice;
        rp.totalPrice = item.totalPrice ?? item.quantity * item.unitPrice;
        rp.stock = stock;
        rp.updatedBy = userId;
        await qr.manager.save(SaleReturnProduct, rp);
      }

      await qr.commitTransaction();

      return await this.repo.findOneOrFail({
        where: { id: saved.id },
        relations: [
          'sale',
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

  async softDelete(id: string, userId?: number): Promise<any> {
    const qr: QueryRunner = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const sr = await qr.manager.findOne(SaleReturn, {
        where: { id },
        relations: ['items', 'items.stock'],
      });
      if (!sr) throw new NotFoundError('SaleReturn not found');

      for (const it of sr.items) {
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
        await qr.manager.softRemove(SaleReturnProduct, it);
      }
      await qr.manager.softRemove(SaleReturn, sr);
      await qr.commitTransaction();
      return { deleted: true };
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  async restore(id: string, userId?: number): Promise<any> {
    const qr: QueryRunner = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const sr = await qr.manager.findOne(SaleReturn, {
        where: { id },
        withDeleted: true,
        relations: ['items', 'items.stock'],
      });
      if (!sr) throw new NotFoundError('SaleReturn not found');
      if (!sr.deletedAt) throw new BadRequestError('SaleReturn is not deleted');

      for (const it of sr.items) {
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
      await qr.manager.recover(SaleReturnProduct, sr.items.map(i => ({ id: i.id })));
      await qr.manager.recover(SaleReturn, sr);
      await qr.commitTransaction();
      return { restored: true };
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  async hardDelete(id: string, userId?: number): Promise<any> {
    const qr: QueryRunner = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const sr = await qr.manager.findOne(SaleReturn, {
        where: { id },
        withDeleted: true,
        relations: ['items', 'items.stock'],
      });
      if (!sr) throw new NotFoundError('SaleReturn not found');

      if (!sr.deletedAt) {
        for (const it of sr.items) {
          if (it.stock) {
            const stock = await qr.manager.findOne(Stock, { where: { id: it.stock.id } });
            if (stock) {
              stock.quantity = Math.max(0, stock.quantity - it.quantity);
              await qr.manager.save(Stock, stock);
            }
          }
        }
      }
      for (const it of sr.items) {
        await qr.manager.delete(SaleReturnProduct, it.id);
      }
      await qr.manager.delete(SaleReturn, id);
      await qr.commitTransaction();
      return { deleted: true };
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  async findAll(queryParams: any): Promise<{ data: SaleReturn[]; pagination: { page: number; limit: number; total: number } }> {
    let qb: SelectQueryBuilder<SaleReturn> = this.repo.createQueryBuilder('saleReturn')
      .leftJoinAndSelect('saleReturn.sale', 'sale')
      .leftJoinAndSelect('saleReturn.items', 'items')
      .leftJoinAndSelect('items.product', 'itemProduct')
      .leftJoinAndSelect('items.stock', 'itemStock')
      .leftJoinAndSelect('saleReturn.paymentMethod', 'paymentMethod');
    const includeDeleted = queryParams.includeDeleted === 'true' || queryParams.includeDeleted === true;
    if (includeDeleted) qb = qb.withDeleted();
    const total = await qb.getCount();
    const features = new ApiFeatures<SaleReturn>(qb, queryParams, this.searchableFields)
      .search()
      .filter()
      .sort()
      .paginate();
    const data = await features.getQueryBuilder().getMany();
    const page = parseInt(queryParams.page as string, 10) || 1;
    const limit = parseInt(queryParams.limit as string, 10) || 25;
    return { data, pagination: { page, limit, total } };
  }

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
