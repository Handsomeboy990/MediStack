import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  PaginationQueryDto,
  buildMeta,
} from '../../common/dto/pagination-query.dto';

@Injectable()
export class FacturesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const { page, limit } = query;
    const [items, total] = await Promise.all([
      this.prisma.facture.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { lignes: true },
      }),
      this.prisma.facture.count(),
    ]);
    return { data: items, meta: buildMeta(total, page, limit) };
  }
}
