import { Router, Request, Response, NextFunction } from 'express';
import { PurchaseService } from '../services/purchase.service';
import { CreatePurchaseDto } from '../dtos/CreatePurchaseDto';
import { CreatePurchaseProductDto } from '../dtos/CreatePurchaseProductDto';
import { UpdatePurchaseDto } from '../dtos/UpdatePurchaseDto';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class PurchaseController {
    public router = Router();
    private svc = new PurchaseService();

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
            const dto = plainToClass(CreatePurchaseDto, req.body);
            if (req.body.items) {
                dto.items = (req.body.items as any[]).map(i =>
                    plainToClass(CreatePurchaseProductDto, i)
                );
            }
            await validateOrReject(dto);
            if (dto.items) {
                for (const it of dto.items) {
                    await validateOrReject(it);
                }
            }

            const userId = (req as any).user?.userId;
            const purchase = await this.svc.create(dto, userId);
            res.status(201).json(purchase);
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
            const purchase = await this.svc.repo.findOne({
                where: { id: req.params.id },
                relations: [
                    'supplier', 'store', 'employee',
                    'items', 'items.product', 'items.batch', 'items.stock',
                    'paymentMethod'
                ],
            });
            if (!purchase) return res.status(404).json({ message: 'Not found' });
            res.json(purchase);
        } catch (err) {
            next(err);
        }
    }

    private update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = plainToClass(UpdatePurchaseDto, req.body);
            if (req.body.items) {
                dto.items = (req.body.items as any[]).map(i =>
                    plainToClass(CreatePurchaseProductDto, i)
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
