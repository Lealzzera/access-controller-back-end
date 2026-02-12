import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

export class CreateResponsibleDTO {
  @IsString()
  institutionId: string;

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
  @Length(11, 11, { message: 'CPF must have exactly 11 digits.' })
  @Matches(/^\d+$/, { message: 'CPF must contain only numeric digits.' })
  cpf: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
