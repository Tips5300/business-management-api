import { Repository, ObjectLiteral, DeepPartial } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { ApiFeatures } from '../utils/api-features';
import { exportData, PlainObject } from '../utils/export.util';
import { parseImportFile } from '../utils/import.util';
import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { JournalEntry } from '../entities/JournalEntry';
import { JournalPayload } from '../config/entities';

export class BaseService<T extends ObjectLiteral> {
  protected repo: Repository<T>;
  protected entityName: string;
  protected createDtoClass?: any;
  protected updateDtoClass?: any;
  protected journalConfig?: {
    getEntryPayload: (arg: any) => JournalPayload;
  };

  constructor(options: {
    entity: any;
    entityName: string;
    createDtoClass?: any;
    updateDtoClass?: any;
    journalConfig?: { getEntryPayload: (arg: any) => JournalPayload };
  }) {
    this.repo = AppDataSource.getRepository<T>(options.entity);
    this.entityName = options.entityName;
    this.createDtoClass = options.createDtoClass;
    this.updateDtoClass = options.updateDtoClass;
    this.journalConfig = options.journalConfig;
  }

  async create(data: any, currentUserId?: number): Promise<T> {
    if (this.createDtoClass) {
      await validateOrReject(Object.assign(new this.createDtoClass(), data));
    }
    const newRecord = this.repo.create({
      ...data,
      ...(currentUserId ? { createdBy: currentUserId } : {}),
    });
    const saved = await this.repo.save(newRecord as any);

    if (this.journalConfig) {
      const payload = this.journalConfig.getEntryPayload(saved);
      await this.createJournalEntry(payload, currentUserId);
    }

    return saved;
  }

  async findAll(queryParams: any): Promise<{
    data: T[];
    pagination: { page: number; limit: number; total: number };
  }> {
    const qb = this.repo.createQueryBuilder(this.entityName);
    const total = await qb.getCount();

    const features = new ApiFeatures<T>(
      this.repo.createQueryBuilder(this.entityName),
      queryParams,
      queryParams.searchableFields || []
    )
      .search()
      .filter()
      .sort()
      .paginate();

    const data = await features.getQueryBuilder().getMany();
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 25;
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
    const saved = await this.repo.save(merged as any);

    if (this.journalConfig) {
      const payload = this.journalConfig.getEntryPayload(saved);
      await this.createJournalEntry(payload, currentUserId);
    }

    return saved;
  }

  async softDelete(id: string | number, currentUserId?: number): Promise<void> {
    await this.findOne(id);
    await this.repo.softDelete(id as any);
    if (this.journalConfig) {
      const payload: JournalPayload = this.journalConfig.getEntryPayload(
        await this.repo.findOne({ where: { id } as any, withDeleted: true })
      );
      await this.createJournalEntry(payload, currentUserId);
    }
  }

  async restore(id: string | number, currentUserId?: number): Promise<void> {
    await this.repo.restore(id as any);
    if (this.journalConfig) {
      const payload: JournalPayload = this.journalConfig.getEntryPayload(
        await this.repo.findOne({ where: { id } as any })
      );
      await this.createJournalEntry(payload, currentUserId);
    }
  }

  async hardDelete(id: string | number, currentUserId?: number): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id as any);
    if (this.journalConfig) {
      const payload: JournalPayload = {
        date: new Date().toISOString().split('T')[0],
        refType: `${this.entityName.toUpperCase()}_DELETE`,
        refId: id as string,
        debitAccountId: '',
        creditAccountId: '',
        amount: 0,
        description: `${this.entityName} ${id} permanently deleted`,
      };
      await this.createJournalEntry(payload, currentUserId);
    }
  }

  async export(format: 'json' | 'csv' | 'xlsx', queryParams: any, res: Response) {
    const qb = this.repo.createQueryBuilder(this.entityName);
    const features = new ApiFeatures<T>(
      qb,
      queryParams,
      queryParams.searchableFields || []
    )
      .search()
      .filter()
      .sort();
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

        // Build a DeepPartial<T> and pass it directly to save()
        const partial: DeepPartial<T> = {
          ...rec,
          ...(currentUserId ? { createdBy: currentUserId } : {}),
        } as DeepPartial<T>;

        // Now save() returns Promise<T> (not T[])
        const saved: T = await this.repo.save(partial);

        if (this.journalConfig) {
          const payload = this.journalConfig.getEntryPayload(saved);
          await this.createJournalEntry(payload, currentUserId);
        }

        results.push({ success: true, record: saved });
      } catch (err: any) {
        results.push({ success: false, errors: err });
      }
    }

    return results;
  }

  private async createJournalEntry(payload: JournalPayload, currentUserId?: number) {
    const jeRepo = AppDataSource.getRepository(JournalEntry);
    const newJE = jeRepo.create({
      date: payload.date,
      refType: payload.refType,
      refId: payload.refId,
      debitAccount: { id: payload.debitAccountId } as any,
      creditAccount: { id: payload.creditAccountId } as any,
      amount: payload.amount,
      description: payload.description,
      ...(currentUserId ? { createdBy: currentUserId } : {}),
    });
    await jeRepo.save(newJE);
  }
}