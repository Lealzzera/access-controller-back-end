import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateResponsibleDTO {
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minUppercase: 1,
  })
  password: string;

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
}
