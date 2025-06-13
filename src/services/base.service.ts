// src/services/base.service.ts
import { Repository, ObjectLiteral, DeepPartial, SelectQueryBuilder } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { ApiFeatures } from '../utils/api-features';
import { exportData, PlainObject } from '../utils/export.util';
import { parseImportFile } from '../utils/import.util';
import { Response } from 'express';
import { AppDataSource } from '../config/database';

export class BaseService<T extends ObjectLiteral> {
  protected repo: Repository<T>;
  protected entityName: string;
  protected createDtoClass?: any;
  protected updateDtoClass?: any;
  protected searchableFields: string[];

  constructor(options: {
    entity: any;
    entityName: string;
    createDtoClass?: any;
    updateDtoClass?: any;
    searchableFields?: string[];
  }) {
    this.repo = AppDataSource.getRepository<T>(options.entity);
    this.entityName = options.entityName;
    this.createDtoClass = options.createDtoClass;
    this.updateDtoClass = options.updateDtoClass;
    this.searchableFields = options.searchableFields || [];
  }

  async create(data: any, currentUserId?: number): Promise<T> {
    if (this.createDtoClass) {
      await validateOrReject(Object.assign(new this.createDtoClass(), data));
    }
    const newRecord = this.repo.create({
      ...data,
      ...(currentUserId ? { createdBy: currentUserId } : {}),
    });
    return await this.repo.save(newRecord as any);
  }

  async findAll(queryParams: any): Promise<{
    data: T[];
    pagination: { page: number; limit: number; total: number };
  }> {
    let qb: SelectQueryBuilder<T> = this.repo.createQueryBuilder(this.entityName);
    const includeDeleted = queryParams.includeDeleted === 'true' || queryParams.includeDeleted === true;
    if (includeDeleted) qb = qb.withDeleted();
    const total = await qb.getCount();
    const features = new ApiFeatures<T>(qb, queryParams, this.searchableFields)
      .search()
      .filter()
      .sort()
      .paginate();
    const data = await features.getQueryBuilder().getMany();
    const page = parseInt(queryParams.page as string, 10) || 1;
    const limit = parseInt(queryParams.limit as string, 10) || 25;
    return { data, pagination: { page, limit, total } };
  }

  async findTrash(queryParams: any): Promise<{
    data: T[];
    pagination: { page: number; limit: number; total: number };
  }> {
    let qb = this.repo.createQueryBuilder(this.entityName)
      .withDeleted()
      .andWhere(`${this.entityName}.deletedAt IS NOT NULL`);
    const total = await qb.getCount();
    const features = new ApiFeatures<T>(qb, queryParams, this.searchableFields)
      .search()
      .filter()
      .sort()
      .paginate();
    const data = await features.getQueryBuilder().getMany();
    const page = parseInt(queryParams.page as string, 10) || 1;
    const limit = parseInt(queryParams.limit as string, 10) || 25;
    return { data, pagination: { page, limit, total } };
  }

  async findOne(id: string | number): Promise<T> {
    const record = await this.repo.findOne({ where: { id } as any });
    if (!record) {
      const err: any = new Error(`${this.entityName} not found`);
      err.status = 404;
      throw err;
    }
    return record;
  }

  async update(id: string | number, data: any, currentUserId?: number): Promise<T> {
    if (this.updateDtoClass) {
      await validateOrReject(Object.assign(new this.updateDtoClass(), data));
    }
    const existing = await this.findOne(id);
    const merged = this.repo.merge(existing as any, {
      ...data,
      ...(currentUserId ? { updatedBy: currentUserId } : {}),
    });
    return await this.repo.save(merged as any);
  }

  // Now return Promise<any> so overrides can return objects
  async softDelete(id: string | number, currentUserId?: number): Promise<any> {
    await this.findOne(id);
    await this.repo.softDelete(id as any);
    // Base default could return nothing or a boolean:
    return { deleted: true };
  }

  async restore(id: string | number, currentUserId?: number): Promise<any> {
    await this.repo.restore(id as any);
    return { restored: true };
  }

  async hardDelete(id: string | number, currentUserId?: number): Promise<any> {
    const existing = await this.repo.findOne({
      where: { id } as any,
      withDeleted: true,
    });
    if (!existing) {
      const err: any = new Error(`${this.entityName} not found`);
      err.status = 404;
      throw err;
    }
    await this.repo.delete(id as any);
    return { deleted: true };
  }

  // Bulk operations: also return Promise<any>
  async softDeleteMany(ids: Array<string | number>, currentUserId?: number): Promise<any> {
    if (!Array.isArray(ids) || ids.length === 0) {
      const err: any = new Error(`No IDs provided for bulk soft-delete`);
      err.status = 400;
      throw err;
    }
    await this.repo.createQueryBuilder()
      .softDelete()
      .whereInIds(ids)
      .execute();
    return { deleted: true, count: ids.length };
  }

  async restoreMany(ids: Array<string | number>, currentUserId?: number): Promise<any> {
    if (!Array.isArray(ids) || ids.length === 0) {
      const err: any = new Error(`No IDs provided for bulk restore`);
      err.status = 400;
      throw err;
    }
    await this.repo.createQueryBuilder()
      .restore()
      .whereInIds(ids)
      .execute();
    return { restored: true, count: ids.length };
  }

  async hardDeleteMany(ids: Array<string | number>, currentUserId?: number): Promise<any> {
    if (!Array.isArray(ids) || ids.length === 0) {
      const err: any = new Error(`No IDs provided for bulk hard delete`);
      err.status = 400;
      throw err;
    }
    await this.repo.delete(ids as any[]);
    return { deleted: true, count: ids.length };
  }

  async export(format: 'json' | 'csv' | 'xlsx', queryParams: any, res: Response) {
    let qb = this.repo.createQueryBuilder(this.entityName);
    if (queryParams.includeDeleted === 'true' || queryParams.includeDeleted === true) {
      qb = qb.withDeleted();
    }
    const features = new ApiFeatures<T>(qb, queryParams, this.searchableFields)
      .search()
      .filter()
      .sort();
    if (queryParams.page || queryParams.limit) {
      features.paginate();
    }
    const data = await features.getQueryBuilder().getMany();
    return exportData(format, data as PlainObject[], res);
  }

  async import(file: Express.Multer.File, currentUserId?: number): Promise<any> {
    const records = await parseImportFile({ file } as any);
    const results: { success: boolean; record?: T; errors?: any }[] = [];
    for (const rec of records) {
      try {
        if (this.createDtoClass) {
          await validateOrReject(Object.assign(new this.createDtoClass(), rec));
        }
        const partial: DeepPartial<T> = {
          ...rec,
          ...(currentUserId ? { createdBy: currentUserId } : {}),
        } as DeepPartial<T>;
        const saved: T = await this.repo.save(partial);
        results.push({ success: true, record: saved });
      } catch (err: any) {
        results.push({ success: false, errors: err });
      }
    }
    return results;
  }
}
