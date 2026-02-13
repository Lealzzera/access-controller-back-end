import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString, Length, Matches } from 'class-validator';

export class RegisterChildDTO {
  @IsString()
  name: string;

  @IsString()
  @Length(11, 11, { message: 'CPF must have exactly 11 digits.' })
  @Matches(/^\d+$/, { message: 'CPF must contain only numeric digits.' })
  cpf: string;

  @IsString()
  gradeId: string;

  @IsString()
  periodId: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  birthDate: Date;

  @IsString()
  institutionId: string;

  @IsString()
  responsibleId: string;

  @IsOptional()
  @IsString()
  kinship?: string;
}
