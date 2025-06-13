// src/controllers/base.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { BaseService } from '../services/base.service';
import { ObjectLiteral } from 'typeorm';

export class BaseController<T extends ObjectLiteral> {
  protected service: BaseService<T>;
  protected entityName: string;

  constructor(service: BaseService<T>) {
    this.service = service;
    this.entityName = (service as any).entityName;
  }

  create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const userId = req.user?.userId;
      const created = await this.service.create(req.body, userId);
      return res.status(201).json(created);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  getAll = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const includeDeleted = req.query.includeDeleted === 'true' || req.query.includeDeleted === true as any;
      if (includeDeleted) {
        const hasViewTrash = (req.user?.permissions || []).some(
          p => p.module === this.entityName && p.action === 'viewTrash' && p.allowed
        );
        if (!hasViewTrash) {
          return res.status(403).json({ error: 'Forbidden: insufficient permission to view deleted items' });
        }
      }
      const result = await this.service.findAll(req.query);
      return res.json(result);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  getTrash = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const result = await this.service.findTrash(req.query);
      return res.json(result);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  getOne = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const id = req.params.id;
      const record = await this.service.findOne(id);
      return res.json(record);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const id = req.params.id;
      const userId = req.user?.userId;
      const updated = await this.service.update(id, req.body, userId);
      return res.json(updated);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  softDelete = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const id = req.params.id;
      const userId = req.user?.userId;
      const result = await this.service.softDelete(id, userId);
      return res.json(result);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  restore = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const id = req.params.id;
      const userId = req.user?.userId;
      const result = await this.service.restore(id, userId);
      return res.json(result);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  hardDelete = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const id = req.params.id;
      const userId = req.user?.userId;
      const result = await this.service.hardDelete(id, userId);
      return res.json(result);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  // Bulk endpoints
  softDeleteMany = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const ids: Array<string | number> = req.body.ids;
      const userId = req.user?.userId;
      const result = await this.service.softDeleteMany(ids, userId);
      return res.json(result);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  restoreMany = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const ids: Array<string | number> = req.body.ids;
      const userId = req.user?.userId;
      const result = await this.service.restoreMany(ids, userId);
      return res.json(result);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  hardDeleteMany = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const ids: Array<string | number> = req.body.ids;
      const userId = req.user?.userId;
      const result = await this.service.hardDeleteMany(ids, userId);
      return res.json(result);
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  export = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const { format } = req.params;
      if (!['json', 'csv', 'xlsx'].includes(format)) {
        return res.status(400).json({ error: 'Unsupported export format' });
      }
      await this.service.export(format as 'json' | 'csv' | 'xlsx', req.query, res);
      return undefined; // export writes directly to res
    } catch (err) {
      next(err);
      return undefined;
    }
  };

  import = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const userId = req.user?.userId;
      // @ts-ignore
      const results = await this.service.import(req.file, userId);
      return res.json({ results });
    } catch (err) {
      next(err);
      return undefined;
    }
  };
}
