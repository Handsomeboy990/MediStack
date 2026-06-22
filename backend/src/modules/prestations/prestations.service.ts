import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  PaginationQueryDto,
  buildMeta,
} from '../../common/dto/pagination-query.dto';

@Injectable()
export class PrestationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const { page, limit } = query;
    const [items, total] = await Promise.all([
      this.prisma.prestation.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { libelle: 'asc' },
      }),
      this.prisma.prestation.count(),
    ]);
    return { data: items, meta: buildMeta(total, page, limit) };
  }
}
