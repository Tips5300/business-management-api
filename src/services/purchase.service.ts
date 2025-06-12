import { QueryRunner } from 'typeorm';
import { AppDataSource } from '../ormconfig';
import { Purchase } from '../entities/Purchase';
import { PurchaseProduct } from '../entities/PurchaseProduct';
import { Stock } from '../entities/Stock';
import { Supplier } from '../entities/Supplier';
import { Store } from '../entities/Store';
import { Employee } from '../entities/Employee';
import { Batch } from '../entities/Batch';
import { PaymentMethod } from '../entities/PaymentMethod';
import { CreatePurchaseDto } from '../dtos/CreatePurchaseDto';
import { CreatePurchaseProductDto } from '../dtos/CreatePurchaseProductDto';
import { UpdatePurchaseDto } from '../dtos/UpdatePurchaseDto';
import { BadRequestError, NotFoundError } from '../utils/errors';

export class PurchaseService {
    private repo = AppDataSource.getRepository(Purchase);

    async create(dto: CreatePurchaseDto, currentUserId?: number): Promise<Purchase> {
        const qr: QueryRunner = AppDataSource.createQueryRunner();
        await qr.connect(); await qr.startTransaction();

        try {
            // 1. instantiate Purchase
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

            // 2. relations
            if (dto.supplier) p.supplier = await qr.manager.findOneOrFail(Supplier, dto.supplier);
            if (dto.store) p.store = await qr.manager.findOneOrFail(Store, dto.store);
            if (dto.employee) p.employee = await qr.manager.findOneOrFail(Employee, dto.employee);
            if (dto.paymentMethod) p.paymentMethod = await qr.manager.findOneOrFail(PaymentMethod, dto.paymentMethod);

            const saved = await qr.manager.save(Purchase, p);

            // 3. process items
            for (const item of (dto as any).items as CreatePurchaseProductDto[]) {
                // lock batch
                const batch = await qr.manager
                    .createQueryBuilder(Batch, 'b')
                    .setLock('pessimistic_read')
                    .where('b.id = :id', { id: item.batch })
                    .leftJoinAndSelect('b.product', 'product')
                    .getOne();
                if (!batch) throw new BadRequestError('Invalid batch');
                if (batch.product.id !== item.product)
                    throw new BadRequestError('batch/product mismatch');

                // save PurchaseProduct
                const pp = new PurchaseProduct();
                pp.purchase = saved;
                pp.product = batch.product;
                pp.batch = batch;
                pp.quantity = item.quantity;
                pp.unitCost = item.unitCost;
                pp.totalCost = item.totalCost ?? item.quantity * item.unitCost;
                pp.createdBy = currentUserId;
                const savedPP = await qr.manager.save(PurchaseProduct, pp);

                // adjust stock
                let stock = await qr.manager
                    .createQueryBuilder(Stock, 's')
                    .setLock('pessimistic_write')
                    .where('s.batchId = :b AND s.productId = :p', {
                        b: batch.id,
                        p: batch.product.id,
                    })
                    .getOne();

                if (stock) {
                    stock.quantity += item.quantity;
                } else {
                    stock = new Stock();
                    stock.batch = batch;
                    stock.product = batch.product;
                    stock.quantity = item.quantity;
                    stock.createdBy = currentUserId;
                }
                const savedStock = await qr.manager.save(Stock, stock);

                // attach stock back to PP
                savedPP.stock = savedStock;
                await qr.manager.save(PurchaseProduct, savedPP);
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

    async update(id: string, dto: UpdatePurchaseDto, currentUserId?: number): Promise<Purchase> {
        const qr = AppDataSource.createQueryRunner();
        await qr.connect(); await qr.startTransaction();

        try {
            // 1. load existing w/ items & stock
            const existing = await qr.manager.findOne(Purchase, {
                where: { id },
                relations: ['items', 'items.stock', 'items.batch', 'items.product'],
            });
            if (!existing) throw new NotFoundError('Purchase not found');

            // 2. reverse stock + delete old items
            for (const old of existing.items) {
                const st = await qr.manager
                    .createQueryBuilder(Stock, 's')
                    .setLock('pessimistic_write')
                    .where('s.id = :id', { id: old.stock.id })
                    .getOne();
                if (st) {
                    st.quantity = Math.max(0, st.quantity - old.quantity);
                    await qr.manager.save(Stock, st);
                }
                await qr.manager.remove(PurchaseProduct, old);
            }

            // 3. update scalar fields
            if (dto.purchaseDate) existing.purchaseDate = dto.purchaseDate;
            if (dto.subTotal) existing.subTotal = parseFloat(dto.subTotal);
            if (dto.discount) existing.discount = parseFloat(dto.discount);
            if (dto.taxAmount) existing.taxAmount = parseFloat(dto.taxAmount);
            if (dto.shippingCharge) existing.shippingCharge = parseFloat(dto.shippingCharge);
            if (dto.totalAmount) existing.totalAmount = parseFloat(dto.totalAmount);
            if (dto.dueAmount) existing.dueAmount = parseFloat(dto.dueAmount);
            if (dto.status) existing.status = dto.status;
            if (dto.notes !== undefined) existing.notes = dto.notes;
            if (dto.invoiceNumber !== undefined) existing.invoiceNumber = dto.invoiceNumber;
            if (dto.receiptOrAny) existing.receiptOrAny = dto.receiptOrAny;
            existing.updatedBy = currentUserId;

            // 4. update relations if given
            if (dto.supplier) existing.supplier = await qr.manager.findOneOrFail(Supplier, dto.supplier);
            if (dto.store) existing.store = await qr.manager.findOneOrFail(Store, dto.store);
            if (dto.employee) existing.employee = await qr.manager.findOneOrFail(Employee, dto.employee);
            if (dto.paymentMethod !== undefined) {
                existing.paymentMethod = dto.paymentMethod
                    ? await qr.manager.findOneOrFail(PaymentMethod, dto.paymentMethod)
                    : undefined;
            }

            const saved = await qr.manager.save(Purchase, existing);

            // 5. insert new items if provided
            if ((dto as any).items) {
                for (const item of (dto as any).items as CreatePurchaseProductDto[]) {
                    const batch = await qr.manager
                        .createQueryBuilder(Batch, 'b')
                        .setLock('pessimistic_read')
                        .where('b.id = :id', { id: item.batch })
                        .leftJoinAndSelect('b.product', 'product')
                        .getOne();
                    if (!batch) throw new BadRequestError('Invalid batch');
                    if (batch.product.id !== item.product)
                        throw new BadRequestError('batch/product mismatch');

                    const pp = new PurchaseProduct();
                    pp.purchase = saved;
                    pp.product = batch.product;
                    pp.batch = batch;
                    pp.quantity = item.quantity;
                    pp.unitCost = item.unitCost;
                    pp.totalCost = item.totalCost ?? item.quantity * item.unitCost;
                    pp.updatedBy = currentUserId;
                    const savedPP = await qr.manager.save(PurchaseProduct, pp);

                    let stock = await qr.manager
                        .createQueryBuilder(Stock, 's')
                        .setLock('pessimistic_write')
                        .where('s.batchId = :b AND s.productId = :p', {
                            b: batch.id,
                            p: batch.product.id,
                        })
                        .getOne();

                    if (stock) {
                        stock.quantity += item.quantity;
                    } else {
                        stock = new Stock();
                        stock.batch = batch;
                        stock.product = batch.product;
                        stock.quantity = item.quantity;
                        stock.createdBy = currentUserId;
                    }
                    const savedStock = await qr.manager.save(Stock, stock);

                    savedPP.stock = savedStock;
                    await qr.manager.save(PurchaseProduct, savedPP);
                }
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

    async softDelete(id: string): Promise<{ deleted: boolean }> {
        const qr = AppDataSource.createQueryRunner();
        await qr.connect(); await qr.startTransaction();
        try {
            const purchase = await qr.manager.findOne(Purchase, {
                where: { id }, relations: ['items', 'items.stock']
            });
            if (!purchase) throw new NotFoundError('Purchase not found');

            for (const it of purchase.items) {
                const st = await qr.manager
                    .createQueryBuilder(Stock, 's')
                    .setLock('pessimistic_write')
                    .where('s.id = :id', { id: it.stock.id })
                    .getOne();
                if (st) {
                    st.quantity = Math.max(0, st.quantity - it.quantity);
                    await qr.manager.save(Stock, st);
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

    /** RESTORE a soft-deleted Purchase */
    async restore(id: string): Promise<{ restored: boolean }> {
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

            // re-apply stock increment
            for (const it of purchase.items) {
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

            await qr.manager.recover(PurchaseProduct, purchase.items.map((i) => i.id));
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


    async hardDelete(id: string): Promise<{ deleted: boolean }> {
        const qr = AppDataSource.createQueryRunner();
        await qr.connect(); await qr.startTransaction();
        try {
            const purchase = await qr.manager.findOne(Purchase, {
                where: { id }, withDeleted: true, relations: ['items', 'items.stock']
            });
            if (!purchase) throw new NotFoundError('Purchase not found');

            if (!purchase.deletedAt) {
                for (const it of purchase.items) {
                    const st = await qr.manager.findOne(Stock, { where: { id: it.stock.id } });
                    if (st) {
                        st.quantity = Math.max(0, st.quantity - it.quantity);
                        await qr.manager.save(Stock, st);
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
}
