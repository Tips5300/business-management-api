import { QueryRunner } from 'typeorm';
import { AppDataSource } from '../ormconfig';
import { SaleReturn } from '../entities/SaleReturn';
import { SaleReturnProduct } from '../entities/SaleReturnProduct';
import { Sale } from '../entities/Sale';
import { Stock } from '../entities/Stock';
import { PaymentMethod } from '../entities/PaymentMethod';
import { CreateSaleReturnDto } from '../dtos/CreateSaleReturnDto';
import { CreateSaleReturnProductDto } from '../dtos/CreateSaleReturnProductDto';
import { UpdateSaleReturnDto } from '../dtos/UpdateSaleReturnDto';
import { BadRequestError, NotFoundError } from '../utils/errors';

export class SaleReturnService {
    private repo = AppDataSource.getRepository(SaleReturn);

    async create(dto: CreateSaleReturnDto, userId?: number): Promise<SaleReturn> {
        const qr: QueryRunner = AppDataSource.createQueryRunner();
        await qr.connect(); await qr.startTransaction();
        try {
            // 1. Validate sale
            const sale = await qr.manager.findOne(Sale, {
                where: { id: dto.sale },
                relations: ['items', 'items.stock', 'items.product'],
            });
            if (!sale) throw new BadRequestError('Invalid sale');

            // 2. Instantiate
            const sr = new SaleReturn();
            sr.returnDate = dto.returnDate;
            sr.totalReturnAmount = dto.totalReturnAmount ?? 0;
            sr.sale = sale;
            sr.paymentMethod = dto.paymentMethod
                ? await qr.manager.findOneOrFail(PaymentMethod, dto.paymentMethod)
                : undefined;
            sr.createdBy = userId;

            const saved = await qr.manager.save(SaleReturn, sr);

            // 3. Process items (increase stock)
            for (const item of dto.items as CreateSaleReturnProductDto[]) {
                const stock = await qr.manager
                    .createQueryBuilder(Stock, 's')
                    .setLock('pessimistic_write')
                    .where('s.id = :id', { id: item.stock })
                    .leftJoinAndSelect('s.product', 'product')
                    .getOne();
                if (!stock) throw new BadRequestError('Invalid stock');
                if (stock.product.id !== item.product)
                    throw new BadRequestError('stock/product mismatch');

                stock.quantity += item.quantity;
                await qr.manager.save(Stock, stock);

                const rp = new SaleReturnProduct();
                rp.saleReturn = saved;
                rp.product = stock.product;
                rp.quantity = item.quantity;
                rp.unitPrice = item.unitPrice;
                rp.totalPrice = item.totalPrice ?? item.quantity * item.unitPrice;
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
                    'items.saleReturn',
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
        const qr = AppDataSource.createQueryRunner();
        await qr.connect(); await qr.startTransaction();
        try {
            const sr = await qr.manager.findOne(SaleReturn, {
                where: { id },
                relations: ['items', 'items.saleReturn', 'items.product', 'items.saleReturn', 'sale', 'items.saleReturn', 'items.product', 'items.saleReturn', 'items.product', 'items.saleReturn'], // ensure items & stock loaded?
                // actually we only need items, but stock relation is on SaleReturnProduct? It's not stored, so fine.
            });
            if (!sr) throw new NotFoundError('SaleReturn not found');

            // reverse old items: decrease stock
            for (const old of sr.items) {
                const stock = await qr.manager
                    .createQueryBuilder(Stock, 's')
                    .setLock('pessimistic_write')
                    .where('s.id = :id', { id: old.stock!.id })
                    .getOne();
                if (stock) {
                    stock.quantity -= old.quantity;
                    await qr.manager.save(Stock, stock);
                }
                await qr.manager.remove(SaleReturnProduct, old);
            }

            // update scalar fields
            if (dto.returnDate) sr.returnDate = dto.returnDate;
            if (dto.totalReturnAmount !== undefined) sr.totalReturnAmount = dto.totalReturnAmount;
            if (dto.paymentMethod !== undefined) {
                sr.paymentMethod = dto.paymentMethod
                    ? await qr.manager.findOneOrFail(PaymentMethod, dto.paymentMethod)
                    : undefined;
            }
            sr.updatedBy = userId;

            // update sale relation if changed
            if (dto.sale) {
                sr.sale = await qr.manager.findOneOrFail(Sale, dto.sale);
            }

            const saved = await qr.manager.save(SaleReturn, sr);

            // add new items
            for (const item of dto.items as CreateSaleReturnProductDto[]) {
                const stock = await qr.manager
                    .createQueryBuilder(Stock, 's')
                    .setLock('pessimistic_write')
                    .where('s.id = :id', { id: item.stock })
                    .leftJoinAndSelect('s.product', 'product')
                    .getOne();
                if (!stock) throw new BadRequestError('Invalid stock');
                if (stock.product.id !== item.product)
                    throw new BadRequestError('stock/product mismatch');

                stock.quantity += item.quantity;
                await qr.manager.save(Stock, stock);

                const rp = new SaleReturnProduct();
                rp.saleReturn = saved;
                rp.product = stock.product;
                rp.quantity = item.quantity;
                rp.unitPrice = item.unitPrice;
                rp.totalPrice = item.totalPrice ?? item.quantity * item.unitPrice;
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

    async softDelete(id: string): Promise<{ deleted: boolean }> {
        const qr = AppDataSource.createQueryRunner();
        await qr.connect(); await qr.startTransaction();
        try {
            const sr = await qr.manager.findOne(SaleReturn, {
                where: { id },
                relations: ['items'],
            });
            if (!sr) throw new NotFoundError('SaleReturn not found');

            // reverse stock for items
            for (const it of sr.items) {
                const stock = await qr.manager
                    .createQueryBuilder(Stock, 's')
                    .setLock('pessimistic_write')
                    .where('s.id = :id', { id: it.stock!.id })
                    .getOne();
                if (stock) {
                    stock.quantity -= it.quantity;
                    await qr.manager.save(Stock, stock);
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

    /** RESTORE a soft-deleted SaleReturn */
    async restore(id: string): Promise<{ restored: boolean }> {
        const qr = AppDataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();
        try {
            const sr = await qr.manager.findOne(SaleReturn, {
                where: { id },
                withDeleted: true,
                relations: ['items', 'items.saleReturn'],
            });
            if (!sr) throw new NotFoundError('SaleReturn not found');
            if (!sr.deletedAt) throw new BadRequestError('SaleReturn is not deleted');

            // re-apply stock increase
            for (const it of sr.items) {
                const st = await qr.manager
                    .createQueryBuilder(Stock, 's')
                    .setLock('pessimistic_write')
                    .where('s.id = :id', { id: it.stock!.id })
                    .getOne();
                if (!st) throw new BadRequestError('Missing stock row on restore');
                st.quantity += it.quantity;
                await qr.manager.save(Stock, st);
            }

            await qr.manager.recover(SaleReturnProduct, sr.items.map((i) => i.id));
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


    async hardDelete(id: string): Promise<{ deleted: boolean }> {
        const qr = AppDataSource.createQueryRunner();
        await qr.connect(); await qr.startTransaction();
        try {
            const sr = await qr.manager.findOne(SaleReturn, {
                where: { id },
                withDeleted: true,
                relations: ['items'],
            });
            if (!sr) throw new NotFoundError('SaleReturn not found');

            // if not soft-deleted, reverse now
            if (!sr.deletedAt) {
                for (const it of sr.items) {
                    const stock = await qr.manager.findOne(Stock, { where: { id: it.stock!.id } });
                    if (stock) {
                        stock.quantity -= it.quantity;
                        await qr.manager.save(Stock, stock);
                    }
                }
            }

            // delete items & return
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
}
