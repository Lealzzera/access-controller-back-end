import {
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

export class RegisterInstitutionDTO {
  @IsString()
  name: string;

  @IsString()
  @Length(14, 14, { message: 'CNPJ must have exactly 14 digits.' })
  @Matches(/^\d+$/, { message: 'CNPJ must contain only numeric digits.' })
  cnpj: string;

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  neighborhood: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @IsOptional()
  cep: string;

  @IsString()
  @IsOptional()
  picture: string;

  @IsString()
  email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
  })
  password: string;

  @IsString()
  responsible: string;
}
