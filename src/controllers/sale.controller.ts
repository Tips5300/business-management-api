import { Router, Response, NextFunction } from 'express';
import { SaleService } from '../services/sale.service';
import { CreateSaleDto } from '../dtos/CreateSaleDto';
import { CreateSaleProductDto } from '../dtos/CreateSaleProductDto';
import { UpdateSaleDto } from '../dtos/UpdateSaleDto';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AuthRequest } from '../middlewares/auth.middleware';
import { BaseController } from './base.controller';
import { requirePermission } from '../middlewares/permission.middleware';
import { Sale } from '../entities/Sale';

export class SaleController extends BaseController<Sale> {
  public router = Router();
  private svc = new SaleService();

  constructor() {
    super(new SaleService());
    this.router.post(
      '/',
      this.wrapAuth('create'),
      this.create
    );
    this.router.get(
      '/',
      this.wrapAuth('read'),
      this.findAll
    );
    this.router.get(
      '/trash',
      this.wrapAuth('viewTrash'),
      this.getTrash
    );
    this.router.get(
      '/:id',
      this.wrapAuth('read'),
      this.findOne
    );
    this.router.put(
      '/:id',
      this.wrapAuth('update'),
      this.update
    );
    this.router.patch(
      '/:id/soft-delete',
      this.wrapAuth('delete'),
      this.softDelete
    );
    this.router.patch(
      '/:id/restore',
      this.wrapAuth('restore'),
      this.restore
    );
    this.router.delete(
      '/:id/hard',
      this.wrapAuth('hardDelete'),
      this.hardDelete
    );
    // bulk endpoints
    this.router.patch(
      '/bulk-soft-delete',
      this.wrapAuth('delete'),
      this.softDeleteMany
    );
    this.router.patch(
      '/bulk-restore',
      this.wrapAuth('restore'),
      this.restoreMany
    );
    this.router.delete(
      '/bulk',
      this.wrapAuth('hardDelete'),
      this.hardDeleteMany
    );
  }

  private wrapAuth(action: string) {
    return [
      (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
          return res.status(401).json({ error: 'Not authenticated' });
        }
        next();
      },
      requirePermission('sale', action),
    ];
  }

  public create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response|undefined> => {
    try {
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
      const userId = req.user?.userId;
      const sale = await this.svc.create(dto, userId);
      return res.status(201).json(sale);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  public findAll = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response|undefined> => {
    try {
      const result = await this.svc.findAll(req.query);
      return res.json(result);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  public getTrash = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response|undefined> => {
    try {
      const result = await this.svc.findTrash(req.query);
      return res.json(result);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  public findOne = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response|undefined> => {
    try {
      const sale = await this.svc.repo.findOne({
        where: { id: req.params.id },
        relations: [
          'customer', 'store', 'employee',
          'items', 'items.product', 'items.stock',
          'paymentMethod'
        ],
        withDeleted: req.query.includeDeleted === 'true',
      });
      if (!sale) {
        return res.status(404).json({ message: 'Not found' });
      }
      return res.json(sale);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  public update = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response|undefined> => {
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
      const userId = req.user?.userId;
      const updated = await this.svc.update(req.params.id, dto, userId);
      return res.json(updated);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  public softDelete = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response|undefined> => {
    try {
      const result = await this.svc.softDelete(req.params.id, req.user?.userId);
      return res.json(result);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  public restore = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response|undefined> => {
    try {
      const result = await this.svc.restore(req.params.id, req.user?.userId);
      return res.json(result);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  public hardDelete = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response|undefined> => {
    try {
      const result = await this.svc.hardDelete(req.params.id, req.user?.userId);
      return res.json(result);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  public softDeleteMany = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response|undefined> => {
    try {
      const ids: Array<string|number> = req.body.ids;
      const result = await this.svc.softDeleteMany(ids, req.user?.userId);
      return res.json(result);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  public restoreMany = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response|undefined> => {
    try {
      const ids: Array<string|number> = req.body.ids;
      const result = await this.svc.restoreMany(ids, req.user?.userId);
      return res.json(result);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  public hardDeleteMany = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response|undefined> => {
    try {
      const ids: Array<string|number> = req.body.ids;
      const result = await this.svc.hardDeleteMany(ids, req.user?.userId);
      return res.json(result);
    } catch (err) {
      next(err);
      return undefined;
    }
  };
}
