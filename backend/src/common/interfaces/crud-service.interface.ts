import { PaginationMeta } from '../dto/pagination-query.dto';

// Paginated result aligned with the { data, meta } response envelope.
export interface PaginationResource<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ICrudService<T, CreateDto, UpdateDto> {
  /**
   * Creates a new resource based on the provided createDto data.
   *
   * @param createDto The data required to create the new resource.
   * @returns A promise containing the newly created resource.
   */
  create(createDto: CreateDto): Promise<T>;

  /**
   * Retrieves a paginated list of all resources.
   *
   * @param page The page number to retrieve.
   * @param perPage The number of resources per page.
   * @returns A promise containing the paginated list of resources.
   */
  findAll(page: number, perPage: number): Promise<PaginationResource<T>>;

  /**
   * Retrieves a specific resource based on its identifier.
   *
   * @param id The identifier of the resource to retrieve.
   * @param populate Optional Prisma include applied to the query.
   * @returns A promise containing the retrieved resource.
   */
  findOne(id: string, populate?: Record<string, unknown>): Promise<T>;

  /**
   * Updates a specific resource based on its identifier.
   *
   * @param id The identifier of the resource to update.
   * @param updateDto The data required to update the resource.
   * @returns A promise containing the updated resource.
   */
  update(id: string, updateDto: UpdateDto): Promise<T>;

  /**
   * Permanently deletes a specific resource based on its identifier.
   *
   * @param id The identifier of the resource to hard delete.
   */
  remove(id: string): Promise<void>;

  /**
   * Restores a previously soft-deleted resource based on its identifier.
   *
   * @param id The identifier of the resource to restore.
   */
  restore(id: string): Promise<void>;

  /**
   * Soft deletes a specific resource, marking it as removed without permanently
   * deleting it from the database.
   *
   * @param id The identifier of the resource to soft delete.
   */
  softRemove(id: string): Promise<void>;
}
