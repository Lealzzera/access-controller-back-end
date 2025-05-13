import { IsOptional, IsString } from 'class-validator';

export class UpdateResponsibleDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  picture?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
