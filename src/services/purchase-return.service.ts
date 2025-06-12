import { QueryRunner } from 'typeorm';
import { AppDataSource } from '../ormconfig';
import { PurchaseReturn } from '../entities/PurchaseReturn';
import { PurchaseReturnProduct } from '../entities/PurchaseReturnProduct';
import { Purchase } from '../entities/Purchase';
import { Stock } from '../entities/Stock';
import { PaymentMethod } from '../entities/PaymentMethod';
import { CreatePurchaseReturnDto } from '../dtos/CreatePurchaseReturnDto';
import { CreatePurchaseReturnProductDto } from '../dtos/CreatePurchaseReturnProductDto';
import { UpdatePurchaseReturnDto } from '../dtos/UpdatePurchaseReturnDto';
import { BadRequestError, NotFoundError } from '../utils/errors';

export class PurchaseReturnService {
    private repo = AppDataSource.getRepository(PurchaseReturn);

    async create(dto: CreatePurchaseReturnDto, userId?: number): Promise<PurchaseReturn> {
        const qr: QueryRunner = AppDataSource.createQueryRunner();
        await qr.connect(); await qr.startTransaction();
        try {
            // 1. Validate purchase
            const purchase = await qr.manager.findOne(Purchase, {
                where: { id: dto.purchase },
                relations: ['items', 'items.stock', 'items.product'],
            });
            if (!purchase) throw new BadRequestError('Invalid purchase');

            // 2. Instantiate
            const pr = new PurchaseReturn();
            pr.returnDate = dto.returnDate;
            pr.totalReturnAmount = dto.totalReturnAmount ?? 0;
            pr.purchase = purchase;
            pr.paymentMethod = dto.paymentMethod
                ? await qr.manager.findOneOrFail(PaymentMethod, dto.paymentMethod)
                : undefined;
            pr.createdBy = userId;

            const saved = await qr.manager.save(PurchaseReturn, pr);

            // 3. Items (decrease stock)
            for (const item of dto.items as CreatePurchaseReturnProductDto[]) {
                const stock = await qr.manager
                    .createQueryBuilder(Stock, 's')
                    .setLock('pessimistic_write')
                    .where('s.id = :id', { id: item.stock })
                    .leftJoinAndSelect('s.product', 'product')
                    .getOne();
                if (!stock) throw new BadRequestError('Invalid stock');
                if (stock.quantity < item.quantity)
                    throw new BadRequestError('Return exceeds stock');

                stock.quantity -= item.quantity;
                await qr.manager.save(Stock, stock);

                const rp = new PurchaseReturnProduct();
                rp.purchaseReturn = saved;
                rp.product = stock.product;
                rp.quantity = item.quantity;
                rp.unitPrice = item.unitPrice;
                rp.totalPrice = item.totalPrice ?? item.quantity * item.unitPrice;
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

    async update(id: string, dto: UpdatePurchaseReturnDto, userId?: number): Promise<PurchaseReturn> {
        const qr = AppDataSource.createQueryRunner();
        await qr.connect(); await qr.startTransaction();
        try {
            const pr = await qr.manager.findOne(PurchaseReturn, {
                where: { id },
                relations: ['items', 'items.product', 'items.purchaseReturn'],
            });
            if (!pr) throw new NotFoundError('PurchaseReturn not found');

            // reverse old: increase stock back
            for (const old of pr.items) {
                const stock = await qr.manager
                    .createQueryBuilder(Stock, 's')
                    .setLock('pessimistic_write')
                    .where('s.id = :id', { id: old.stock!.id })
                    .getOne();
                if (stock) {
                    stock.quantity += old.quantity;
                    await qr.manager.save(Stock, stock);
                }
                await qr.manager.remove(PurchaseReturnProduct, old);
            }

            // update scalars
            if (dto.returnDate) pr.returnDate = dto.returnDate;
            if (dto.totalReturnAmount !== undefined) pr.totalReturnAmount = dto.totalReturnAmount;
            if (dto.paymentMethod !== undefined) {
                pr.paymentMethod = dto.paymentMethod
                    ? await qr.manager.findOneOrFail(PaymentMethod, dto.paymentMethod)
                    : undefined;
            }
            pr.updatedBy = userId;

            // update purchase if changed
            if (dto.purchase) {
                pr.purchase = await qr.manager.findOneOrFail(Purchase, dto.purchase);
            }

            const saved = await qr.manager.save(PurchaseReturn, pr);

            // apply new items
            for (const item of dto.items as CreatePurchaseReturnProductDto[]) {
                const stock = await qr.manager
                    .createQueryBuilder(Stock, 's')
                    .setLock('pessimistic_write')
                    .where('s.id = :id', { id: item.stock })
                    .leftJoinAndSelect('s.product', 'product')
                    .getOne();
                if (!stock) throw new BadRequestError('Invalid stock');
                if (stock.quantity < item.quantity)
                    throw new BadRequestError('Return exceeds stock');

                stock.quantity -= item.quantity;
                await qr.manager.save(Stock, stock);

                const rp = new PurchaseReturnProduct();
                rp.purchaseReturn = saved;
                rp.product = stock.product;
                rp.quantity = item.quantity;
                rp.unitPrice = item.unitPrice;
                rp.totalPrice = item.totalPrice ?? item.quantity * item.unitPrice;
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
            const pr = await qr.manager.findOne(PurchaseReturn, {
                where: { id },
                relations: ['items'],
            });
            if (!pr) throw new NotFoundError('PurchaseReturn not found');

            // reverse: increase stock
            for (const it of pr.items) {
                const stock = await qr.manager
                    .createQueryBuilder(Stock, 's')
                    .setLock('pessimistic_write')
                    .where('s.id = :id', { id: it.stock!.id })
                    .getOne();
                if (stock) {
                    stock.quantity += it.quantity;
                    await qr.manager.save(Stock, stock);
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

    /** RESTORE a soft-deleted PurchaseReturn */
    async restore(id: string): Promise<{ restored: boolean }> {
        const qr = AppDataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();
        try {
            const pr = await qr.manager.findOne(PurchaseReturn, {
                where: { id },
                withDeleted: true,
                relations: ['items'],
            });
            if (!pr) throw new NotFoundError('PurchaseReturn not found');
            if (!pr.deletedAt) throw new BadRequestError('PurchaseReturn is not deleted');

            // re-apply stock decrement
            for (const it of pr.items) {
                const st = await qr.manager
                    .createQueryBuilder(Stock, 's')
                    .setLock('pessimistic_write')
                    .where('s.id = :id', { id: it.stock!.id })
                    .getOne();
                if (!st) throw new BadRequestError('Missing stock row on restore');
                if (st.quantity < it.quantity)
                    throw new BadRequestError('Insufficient stock to restore return');
                st.quantity -= it.quantity;
                await qr.manager.save(Stock, st);
            }

            await qr.manager.recover(PurchaseReturnProduct, pr.items.map((i) => i.id));
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


    async hardDelete(id: string): Promise<{ deleted: boolean }> {
        const qr = AppDataSource.createQueryRunner();
        await qr.connect(); await qr.startTransaction();
        try {
            const pr = await qr.manager.findOne(PurchaseReturn, {
                where: { id },
                withDeleted: true,
                relations: ['items'],
            });
            if (!pr) throw new NotFoundError('PurchaseReturn not found');

            // if not soft-deleted, reverse now
            if (!pr.deletedAt) {
                for (const it of pr.items) {
                    const stock = await qr.manager.findOne(Stock, { where: { id: it.stock!.id } });
                    if (stock) {
                        stock.quantity += it.quantity;
                        await qr.manager.save(Stock, stock);
                    }
                }
            }

            // delete items & return
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
}
