import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ example: 'Ama' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Koffi' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ required: false, example: 'ama.koffi@example.bj' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, type: [String], example: ['+22997000000'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phoneNumbers?: string[];

  @ApiProperty({ required: false, example: 'Cotonou, Bénin' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, format: 'date-time', example: '1990-05-12' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ required: false, example: 'female' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ required: false, example: 'Béninoise' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ required: false, example: 'Teacher' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiProperty({ required: false, example: 'single' })
  @IsOptional()
  @IsString()
  maritalStatus?: string;
}
