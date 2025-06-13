// src/controllers/user.controller.ts
import { Router, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { UpdateUserDto } from '../dtos/UpdateUserDto';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AuthRequest } from '../middlewares/auth.middleware';
import { BaseController } from './base.controller';
import { requirePermission } from '../middlewares/permission.middleware';
import { User } from '../entities/User';

export class UserController extends BaseController<User> {
  public router = Router();
  private svc = new UserService();

  constructor() {
    super(new UserService());
    this.router.post(
      '/',
      this.wrapAuth('create'),
      this.create
    );
    this.router.get(
      '/',
      this.wrapAuth('read'),
      this.getAll
    );
    this.router.get(
      '/trash',
      this.wrapAuth('viewTrash'),
      this.getTrash
    );
    this.router.get(
      '/:id',
      this.wrapAuth('read'),
      this.getOne
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
      requirePermission('user', action),
    ];
  }

  public create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response|undefined> => {
    try {
      const dto = plainToClass(CreateUserDto, req.body);
      await validateOrReject(dto);
      const userId = req.user?.userId;
      const user = await this.svc.createUser(dto, userId);
      return res.status(201).json(user);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  public getAll = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response|undefined> => {
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

  public getOne = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response|undefined> => {
    try {
      const user = await this.svc.findOne(req.params.id);
      return res.json(user);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  public update = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response|undefined> => {
    try {
      const dto = plainToClass(UpdateUserDto, req.body);
      await validateOrReject(dto);
      const userId = req.user?.userId;
      const updated = await this.svc.updateUser(req.params.id, dto, userId);
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