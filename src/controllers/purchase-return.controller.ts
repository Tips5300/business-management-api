import { Router, Request, Response, NextFunction } from 'express';
import { PurchaseReturnService } from '../services/purchase-return.service';
import { CreatePurchaseReturnDto } from '../dtos/CreatePurchaseReturnDto';
import { CreatePurchaseReturnProductDto } from '../dtos/CreatePurchaseReturnProductDto';
import { UpdatePurchaseReturnDto } from '../dtos/UpdatePurchaseReturnDto';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class PurchaseReturnController {
    public router = Router();
    private svc = new PurchaseReturnService();

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
            const dto = plainToClass(CreatePurchaseReturnDto, req.body);
            dto.items = (req.body.items || []).map((i: any) =>
                plainToClass(CreatePurchaseReturnProductDto, i)
            );
            await validateOrReject(dto);
            for (const it of dto.items) await validateOrReject(it);

            const userId = (req as any).user?.userId;
            const pr = await this.svc.create(dto, userId);
            res.status(201).json(pr);
        } catch (err) {
            next(err);
        }
    }

    private findAll = async (_: Request, res: Response, next: NextFunction) => {
        try {
            const list = await this.svc.repo.find({
                relations: ['purchase', 'items', 'items.product', 'paymentMethod'],
            });
            res.json(list);
        } catch (err) {
            next(err);
        }
    }

    private findOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pr = await this.svc.repo.findOne({
                where: { id: req.params.id },
                relations: ['purchase', 'items', 'items.product', 'paymentMethod'],
            });
            if (!pr) return res.status(404).json({ message: 'Not found' });
            res.json(pr);
        } catch (err) {
            next(err);
        }
    }

    private update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = plainToClass(UpdatePurchaseReturnDto, req.body);
            dto.items = (req.body.items || []).map((i: any) =>
                plainToClass(CreatePurchaseReturnProductDto, i)
            );
            await validateOrReject(dto);
            for (const it of dto.items) await validateOrReject(it);

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
