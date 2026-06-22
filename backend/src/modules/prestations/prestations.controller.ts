import { Controller, Get, Query } from '@nestjs/common';
import { PrestationsService } from './prestations.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Controller('prestations')
export class PrestationsController {
  constructor(private readonly prestationsService: PrestationsService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.prestationsService.findAll(query);
  }
}
