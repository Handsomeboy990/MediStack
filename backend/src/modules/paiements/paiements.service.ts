import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  PaginationQueryDto,
  buildMeta,
} from '../../common/dto/pagination-query.dto';

@Injectable()
export class PaiementsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const { page, limit } = query;
    const [items, total] = await Promise.all([
      this.prisma.paiement.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.paiement.count(),
    ]);
    return { data: items, meta: buildMeta(total, page, limit) };
  }
}
