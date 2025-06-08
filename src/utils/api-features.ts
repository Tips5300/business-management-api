import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

export class ApiFeatures<T extends ObjectLiteral> {
  private queryBuilder: SelectQueryBuilder<T>;
  private queryString: any;
  private searchableFields: string[];

  constructor(
    queryBuilder: SelectQueryBuilder<T>,
    queryString: any,
    searchableFields: string[] = []
  ) {
    this.queryBuilder = queryBuilder;
    this.queryString = queryString;
    this.searchableFields = searchableFields;
  }

  search(): this {
    const { search } = this.queryString;
    if (search && this.searchableFields.length) {
      const keyword = `%${search}%`;
      this.queryBuilder.andWhere(
        new Array(this.searchableFields.length)
          .fill(0)
          .map((_, i) => `${this.queryBuilder.alias}.${this.searchableFields[i]} LIKE :keyword`)
          .join(' OR '),
        { keyword }
      );
    }
    return this;
  }

  filter(): this {
    const queryObj = { ...this.queryString };
    const removeFields = ['search', 'sort', 'limit', 'page', 'export'];
    removeFields.forEach((el) => delete queryObj[el]);

    for (const [key, value] of Object.entries(queryObj)) {
      const match = key.match(/(.+)(>=|<=|>|<)$/);
      if (match) {
        const field = match[1];
        const op = match[2];
        this.queryBuilder.andWhere(
          `${this.queryBuilder.alias}.${field} ${op} :${field}`,
          { [field]: value }
        );
      } else {
        this.queryBuilder.andWhere(`${this.queryBuilder.alias}.${key} = :${key}`, { [key]: value });
      }
    }

    return this;
  }

  sort(): this {
    const { sort } = this.queryString;
    if (sort) {
      const sortBy = (sort as string).split(',').map((field) => field.trim());
      sortBy.forEach((field) => {
        if (field.startsWith('-')) {
          this.queryBuilder.addOrderBy(
            `${this.queryBuilder.alias}.${field.substring(1)}`,
            'DESC'
          );
        } else {
          this.queryBuilder.addOrderBy(`${this.queryBuilder.alias}.${field}`, 'ASC');
        }
      });
    }
    return this;
  }

  paginate(): this {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 25;
    const skip = (page - 1) * limit;
    this.queryBuilder.skip(skip).take(limit);
    return this;
  }

  getQueryBuilder(): SelectQueryBuilder<T> {
    return this.queryBuilder;
  }
}