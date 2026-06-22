import { Controller, Get, Query } from '@nestjs/common';
import { PaiementsService } from './paiements.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Controller('paiements')
export class PaiementsController {
  constructor(private readonly paiementsService: PaiementsService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.paiementsService.findAll(query);
  }
}
