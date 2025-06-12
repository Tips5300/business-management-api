import { QueryRunner } from 'typeorm';
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

export class SaleService {
    public repo = AppDataSource.getRepository(Sale);

    async create(dto: CreateSaleDto, currentUserId?: number): Promise<Sale> {
        const qr = AppDataSource.createQueryRunner();
        await qr.connect(); 
        await qr.startTransaction();
        
        try {
            // 1. Create Sale
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

            // 2. Set relations
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

            // 3. Process items
            const items = (dto as any).items as CreateSaleProductDto[];
            if (items && items.length > 0) {
                for (const item of items) {
                    // Get and lock stock
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

                    // Reduce stock
                    stock.quantity -= item.quantity;
                    await qr.manager.save(Stock, stock);

                    // Create SaleProduct
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

            // Reverse old items (restore stock)
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

            // Update scalar fields
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

            // Update relations if provided
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

            const updated = await qr.manager.save(Sale, sale);

            // Add new items
            const items = (dto as any).items as CreateSaleProductDto[];
            if (items && items.length > 0) {
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
                    sp.sale = updated;
                    sp.product = stock.product;
                    sp.stock = stock;
                    sp.quantity = item.quantity;
                    sp.unitPrice = item.unitPrice;
                    sp.totalPrice = item.totalPrice ?? item.quantity * item.unitPrice;
                    sp.updatedBy = currentUserId;
                    await qr.manager.save(SaleProduct, sp);
                }
            }

            await qr.commitTransaction();
            
            return await this.repo.findOneOrFail({
                where: { id: updated.id },
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

    async softDelete(id: string): Promise<{ deleted: boolean }> {
        const qr = AppDataSource.createQueryRunner();
        await qr.connect(); 
        await qr.startTransaction();
        
        try {
            const sale = await qr.manager.findOne(Sale, {
                where: { id }, 
                relations: ['items', 'items.stock']
            });
            if (!sale) throw new NotFoundError('Sale not found');

            // Reverse stock and soft-remove items
            for (const it of sale.items) {
                if (it.stock) {
                    const st = await qr.manager
                        .createQueryBuilder(Stock, 'stock')
                        .setLock('pessimistic_write')
                        .where('stock.id = :id', { id: it.stock.id })
                        .getOne();
                    if (st) {
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

    async restore(id: string): Promise<{ restored: boolean }> {
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

            // Re-apply stock decrement for each item
            for (const it of sale.items) {
                if (it.stock) {
                    const st = await qr.manager
                        .createQueryBuilder(Stock, 's')
                        .setLock('pessimistic_write')
                        .where('s.id = :id', { id: it.stock.id })
                        .getOne();
                    if (!st) throw new BadRequestError('Stock row missing on restore');
                    if (st.quantity < it.quantity) {
                        throw new BadRequestError(
                            `Insufficient stock to restore sale item ${it.id}. Available: ${st.quantity}, Required: ${it.quantity}`
                        );
                    }
                    st.quantity -= it.quantity;
                    await qr.manager.save(Stock, st);
                }
            }

            // Recover child items and sale
            await qr.manager.recover(SaleProduct, sale.items.map((i) => i.id));
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

    async hardDelete(id: string): Promise<{ deleted: boolean }> {
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

            // If not soft-deleted, reverse once more
            if (!sale.deletedAt) {
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

            // Delete products and sale
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
}