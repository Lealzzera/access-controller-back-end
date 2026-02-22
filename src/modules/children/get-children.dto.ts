import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetChildrenDTO {
  @IsString({
    message: 'Institution ID must be a string',
  })
  @IsNotEmpty({ message: 'Institution ID must be provided' })
  institutionId: string;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsString()
  take?: string;
}
