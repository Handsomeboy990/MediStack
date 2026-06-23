import { BadRequestException, NotFoundException } from '@nestjs/common';
import { buildMeta } from '../dto/pagination-query.dto';
import {
  ICrudService,
  PaginationResource,
} from '../interfaces/crud-service.interface';

// Minimal shape of a Prisma model delegate used by the base service. Typed
// loosely because each generated delegate has its own argument types.
export interface PrismaModelDelegate {
  create(args: { data: unknown }): Promise<unknown>;
  findMany(args: unknown): Promise<unknown[]>;
  count(args: unknown): Promise<number>;
  findUnique(args: unknown): Promise<unknown>;
  findFirst(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
  delete(args: unknown): Promise<unknown>;
}

export interface BaseCrudOptions {
  // When true, deletes are soft (deletedAt column) and reads filter it out.
  // The targeted model must expose a nullable deletedAt column.
  softDelete?: boolean;
  // Default Prisma include applied to findOne/findAll.
  defaultInclude?: Record<string, unknown>;
}

// Generic CRUD service backed by a Prisma model delegate. Concrete services
// extend it and only add model-specific behaviour.
export abstract class BaseCrudService<
  T,
  CreateDto,
  UpdateDto,
> implements ICrudService<T, CreateDto, UpdateDto> {
  protected constructor(
    protected readonly model: PrismaModelDelegate,
    protected readonly options: BaseCrudOptions = {},
  ) {}

  create(createDto: CreateDto): Promise<T> {
    return this.model.create({ data: createDto }) as Promise<T>;
  }

  async findAll(page: number, perPage: number): Promise<PaginationResource<T>> {
    const where = this.options.softDelete ? { deletedAt: null } : {};
    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: this.options.defaultInclude,
      }),
      this.model.count({ where }),
    ]);
    return { data: data as T[], meta: buildMeta(total, page, perPage) };
  }

  async findOne(id: string, populate?: Record<string, unknown>): Promise<T> {
    const include = populate ?? this.options.defaultInclude;
    const entity = this.options.softDelete
      ? await this.model.findFirst({ where: { id, deletedAt: null }, include })
      : await this.model.findUnique({ where: { id }, include });
    if (!entity) {
      throw new NotFoundException('Resource not found');
    }
    return entity as T;
  }

  async update(id: string, updateDto: UpdateDto): Promise<T> {
    await this.findOne(id);
    return this.model.update({
      where: { id },
      data: updateDto,
    }) as Promise<T>;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.model.delete({ where: { id } });
  }

  async softRemove(id: string): Promise<void> {
    this.assertSoftDelete();
    await this.findOne(id);
    await this.model.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async restore(id: string): Promise<void> {
    this.assertSoftDelete();
    await this.model.update({ where: { id }, data: { deletedAt: null } });
  }

  private assertSoftDelete(): void {
    if (!this.options.softDelete) {
      throw new BadRequestException(
        'Soft delete is not enabled for this resource',
      );
    }
  }
}
