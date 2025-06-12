import { Request, Response, NextFunction } from 'express';
import { BaseService } from '../services/base.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ObjectLiteral } from 'typeorm';

export class BaseController<T extends ObjectLiteral> {
  protected service: BaseService<T>;

  constructor(service: BaseService<T>) {
    this.service = service;
  }

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const created = await this.service.create(req.body, userId);
      return res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findAll(req.query);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const record = await this.service.findOne(id);
      return res.json(record);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const userId = req.user?.userId;
      const updated = await this.service.update(id, req.body, userId);
      return res.json(updated);
    } catch (err) {
      next(err);
    }
  };

  softDelete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const userId = req.user?.userId;
      await this.service.softDelete(id, userId);
      return res.json({ message: 'Soft‐deleted successfully' });
    } catch (err) {
      next(err);
    }
  };

  restore = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const userId = req.user?.userId;
      await this.service.restore(id, userId);
      return res.json({ message: 'Restored successfully' });
    } catch (err) {
      next(err);
    }
  };

  hardDelete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const userId = req.user?.userId;
      await this.service.hardDelete(id, userId);
      return res.json({ message: 'Permanently deleted' });
    } catch (err) {
      next(err);
    }
  };

  export = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { format } = req.params;
      if (!['json', 'csv', 'xlsx'].includes(format)) {
        return res.status(400).json({ error: 'Unsupported export format' });
      }
      // @ts-ignore
      await this.service.export(format, req.query, res);
    } catch (err) {
      next(err);
    }
  };

  import = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      // @ts-ignore
      const results = await this.service.import(req.file, userId);
      return res.json({ results });
    } catch (err) {
      next(err);
    }
  };
}