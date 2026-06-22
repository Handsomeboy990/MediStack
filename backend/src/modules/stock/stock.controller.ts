import { Controller, Get, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.stockService.findAll(query);
  }
}
