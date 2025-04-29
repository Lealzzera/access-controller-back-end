import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class RegisterChildDTO {
  @IsString()
  name: string;

  @IsString()
  cpf: string;

  @IsString()
  gradeId: string;

  @IsString()
  periodId: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  birthDate: Date;

  @IsString()
  @IsOptional()
  picture?: string;

  @IsString()
  institutionId: string;
}
