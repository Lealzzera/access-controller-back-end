import { Transform } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

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
  picture: string;

  @IsString()
  institutionId: string;
}
