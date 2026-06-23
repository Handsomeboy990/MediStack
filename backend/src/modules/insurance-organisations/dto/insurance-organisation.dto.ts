import { ApiProperty } from '@nestjs/swagger';

export class InsuranceOrganisationDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'SUNU Assurances Bénin' })
  name: string;

  @ApiProperty({ required: false, nullable: true })
  description?: string | null;

  @ApiProperty({ required: false, nullable: true })
  address?: string | null;

  @ApiProperty({ type: [String], example: ['+22921000000'] })
  phoneNumbers: string[];

  @ApiProperty({ required: false, nullable: true })
  email?: string | null;

  @ApiProperty({ required: false, nullable: true })
  website?: string | null;

  @ApiProperty({ required: false, nullable: true })
  contactPerson?: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt: Date;
}
