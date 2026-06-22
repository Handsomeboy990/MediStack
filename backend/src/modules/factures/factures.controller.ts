import { Controller, Get, Query } from '@nestjs/common';
import { FacturesService } from './factures.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Controller('factures')
export class FacturesController {
  constructor(private readonly facturesService: FacturesService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.facturesService.findAll(query);
  }
}
