import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientDto } from './dto/patient.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import {
  ApiResponseListSchema,
  ApiResponseSchema,
} from '../../common/decorators/responses/api-response.decorator';

@ApiTags('patients')
@ApiBearerAuth('access-token')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @RequirePermissions('patient:create')
  @ApiOperation({ summary: 'Register a patient' })
  @ApiResponseSchema(PatientDto)
  create(@Body() dto: CreatePatientDto) {
    return this.patientsService.create(dto);
  }

  @Get()
  @RequirePermissions('patient:read')
  @ApiOperation({ summary: 'List patients' })
  @ApiResponseListSchema(PatientDto)
  findAll(@Query() query: PaginationQueryDto) {
    return this.patientsService.findAll(query.page, query.limit);
  }

  @Get(':id')
  @RequirePermissions('patient:read')
  @ApiOperation({ summary: 'Get a patient by id' })
  @ApiResponseSchema(PatientDto)
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('patient:update')
  @ApiOperation({ summary: 'Update a patient' })
  @ApiResponseSchema(PatientDto)
  update(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.patientsService.update(id, dto);
  }
}
