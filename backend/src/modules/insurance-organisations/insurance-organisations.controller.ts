import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InsuranceOrganisationsService } from './insurance-organisations.service';
import { InsuranceOrganisationDto } from './dto/insurance-organisation.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import {
  ApiResponseListSchema,
  ApiResponseSchema,
} from '../../common/decorators/responses/api-response.decorator';

@ApiTags('insurance-organisations')
@ApiBearerAuth('access-token')
@Controller('insurance-organisations')
export class InsuranceOrganisationsController {
  constructor(private readonly service: InsuranceOrganisationsService) {}

  @Get()
  @RequirePermissions('insurance:read')
  @ApiOperation({ summary: 'List insurance organisations' })
  @ApiResponseListSchema(InsuranceOrganisationDto)
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAll(query.page, query.limit);
  }

  @Get(':id')
  @RequirePermissions('insurance:read')
  @ApiOperation({ summary: 'Get an insurance organisation by id' })
  @ApiResponseSchema(InsuranceOrganisationDto)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
