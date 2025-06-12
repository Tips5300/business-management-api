import { Router, Request, Response, NextFunction } from 'express';
import { SaleService } from '../services/sale.service';
import { CreateSaleDto } from '../dtos/CreateSaleDto';
import { CreateSaleProductDto } from '../dtos/CreateSaleProductDto';
import { UpdateSaleDto } from '../dtos/UpdateSaleDto';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class SaleController {
    public router = Router();
    private svc = new SaleService();

    constructor() {
        this.router.post('/', this.create);
        this.router.get('/', this.findAll);
        this.router.get('/:id', this.findOne);
        this.router.patch('/:id', this.update);
        this.router.delete('/:id', this.softRemove);
        this.router.post('/:id/restore', this.restore);
        this.router.delete('/:id/hard', this.hardRemove);
    }

    private create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // allow nested items
            const dto = plainToClass(CreateSaleDto, req.body);
            if (req.body.items) {
                dto.items = (req.body.items as any[]).map(i =>
                    plainToClass(CreateSaleProductDto, i)
                );
            }
            await validateOrReject(dto);
            if (dto.items) {
                for (const it of dto.items) {
                    await validateOrReject(it);
                }
            }

            const userId = (req as any).user?.userId;
            const sale = await this.svc.create(dto, userId);
            res.status(201).json(sale);
        } catch (err) {
            next(err);
        }
    }

    private findAll = async (_: Request, res: Response, next: NextFunction) => {
        try {
            const list = await this.svc.repo.find({ withDeleted: false });
            res.json(list);
        } catch (err) {
            next(err);
        }
    }

    private findOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sale = await this.svc.repo.findOne({
                where: { id: req.params.id },
                relations: [
                    'customer', 'store', 'employee',
                    'items', 'items.product', 'items.stock',
                    'paymentMethod'
                ],
            });
            if (!sale) return res.status(404).json({ message: 'Not found' });
            res.json(sale);
        } catch (err) {
            next(err);
        }
    }

    private update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = plainToClass(UpdateSaleDto, req.body);
            if (req.body.items) {
                dto.items = (req.body.items as any[]).map(i =>
                    plainToClass(CreateSaleProductDto, i)
                );
                for (const it of dto.items) {
                    await validateOrReject(it);
                }
            }
            await validateOrReject(dto);

            const userId = (req as any).user?.userId;
            const updated = await this.svc.update(req.params.id, dto, userId);
            res.json(updated);
        } catch (err) {
            next(err);
        }
    }

    private softRemove = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.svc.softDelete(req.params.id);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    private restore = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.svc.restore(req.params.id);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    private hardRemove = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.svc.hardDelete(req.params.id);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }
}
