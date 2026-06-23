import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PatientInsurancesService } from './patient-insurances.service';
import { CreatePatientInsuranceDto } from './dto/create-patient-insurance.dto';
import { UpdatePatientInsuranceDto } from './dto/update-patient-insurance.dto';
import { PatientInsuranceDto } from './dto/patient-insurance.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import {
  ApiResponseListSchema,
  ApiResponseSchema,
} from '../../common/decorators/responses/api-response.decorator';

@ApiTags('patient-insurances')
@ApiBearerAuth('access-token')
@Controller('patients/:id/insurances')
export class PatientInsurancesController {
  constructor(
    private readonly patientInsurancesService: PatientInsurancesService,
  ) {}

  @Get()
  @RequirePermissions('insurance:read')
  @ApiOperation({ summary: 'List the insurance memberships of a patient' })
  @ApiResponseListSchema(PatientInsuranceDto)
  list(@Param('id') patientId: string) {
    return this.patientInsurancesService.list(patientId);
  }

  @Post()
  @RequirePermissions('insurance:create')
  @ApiOperation({ summary: 'Attach an insurance membership to a patient' })
  @ApiResponseSchema(PatientInsuranceDto)
  create(
    @Param('id') patientId: string,
    @Body() dto: CreatePatientInsuranceDto,
  ) {
    return this.patientInsurancesService.create(patientId, dto);
  }

  @Patch(':membershipId')
  @RequirePermissions('insurance:update')
  @ApiOperation({ summary: 'Update an insurance membership' })
  @ApiResponseSchema(PatientInsuranceDto)
  update(
    @Param('id') patientId: string,
    @Param('membershipId') membershipId: string,
    @Body() dto: UpdatePatientInsuranceDto,
  ) {
    return this.patientInsurancesService.update(patientId, membershipId, dto);
  }

  @Delete(':membershipId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions('insurance:delete')
  @ApiOperation({ summary: 'Remove an insurance membership' })
  remove(
    @Param('id') patientId: string,
    @Param('membershipId') membershipId: string,
  ) {
    return this.patientInsurancesService.remove(patientId, membershipId);
  }
}
