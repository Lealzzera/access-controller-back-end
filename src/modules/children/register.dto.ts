import {
  IsArray,
  IsDate,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Period } from 'src/enums/period.enum';
import { ResponsibleData } from './use-cases/register.service';

export class RegisterChildDTO {
  @IsString()
  name: string;

  @IsString()
  cpf: string;

  @IsString()
  @IsOptional()
  grade?: string;

  @IsString()
  @IsOptional()
  teacher?: string;

  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @IsString()
  @IsOptional()
  picture?: string;

  @IsEnum(Period, {
    message: 'Period must be one of MORNING, AFTERNOON or ALLDAY',
  })
  period: Period;

  @IsString()
  institutionId: string;

  @IsArray()
  responsible: ResponsibleData[];
}
