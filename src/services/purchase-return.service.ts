import { QueryRunner } from 'typeorm';
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

export class PurchaseReturnService {
    public repo = AppDataSource.getRepository(PurchaseReturn);

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

            // 2. Create purchase return
            const pr = new PurchaseReturn();
            pr.returnDate = dto.returnDate;
            pr.totalReturnAmount = dto.totalReturnAmount ?? 0;
            pr.purchase = purchase;
            
            if (dto.paymentMethod) {
                pr.paymentMethod = await qr.manager.findOneOrFail(PaymentMethod, { where: { id: dto.paymentMethod } });
            }
            pr.createdBy = userId;

            const saved = await qr.manager.save(PurchaseReturn, pr);

            // 3. Process items (increase stock back)
            for (const item of dto.items as CreatePurchaseReturnProductDto[]) {
                // Find product
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
                    // Find any stock for this product
                    stock = await qr.manager
                        .createQueryBuilder(Stock, 's')
                        .setLock('pessimistic_write')
                        .where('s.productId = :productId', { productId: item.productId })
                        .getOne();
                }

                if (!stock) {
                    // Create new stock entry
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

    async update(id: string, dto: UpdatePurchaseReturnDto, userId?: number): Promise<PurchaseReturn> {
        const qr = AppDataSource.createQueryRunner();
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

            // Apply new items
            if (dto.items) {
                for (const item of dto.items as CreatePurchaseReturnProductDto[]) {
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

    async softDelete(id: string): Promise<{ deleted: boolean }> {
        const qr = AppDataSource.createQueryRunner();
        await qr.connect(); 
        await qr.startTransaction();
        
        try {
            const pr = await qr.manager.findOne(PurchaseReturn, {
                where: { id },
                relations: ['items', 'items.stock'],
            });
            if (!pr) throw new NotFoundError('PurchaseReturn not found');

            // Reverse stock changes
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

    async restore(id: string): Promise<{ restored: boolean }> {
        const qr = AppDataSource.createQueryRunner();
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

            // Re-apply stock increment
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

            await qr.manager.recover(PurchaseReturnProduct, pr.items.map((i) => ({ id: i.id })));
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
        await qr.connect(); 
        await qr.startTransaction();
        
        try {
            const pr = await qr.manager.findOne(PurchaseReturn, {
                where: { id },
                withDeleted: true,
                relations: ['items', 'items.stock'],
            });
            if (!pr) throw new NotFoundError('PurchaseReturn not found');

            // If not soft-deleted, reverse stock changes now
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

            // Delete items and return
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