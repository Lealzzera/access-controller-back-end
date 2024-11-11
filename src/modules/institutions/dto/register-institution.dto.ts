import { IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class RegisterInstitutionDTO {
  @IsString()
  name: string;

  @IsString()
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
