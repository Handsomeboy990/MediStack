import { Controller, Get, Query } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.patientsService.findAll(query);
  }
}
