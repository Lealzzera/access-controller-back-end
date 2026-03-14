import { IsOptional, IsString, IsNumber, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetResponsiblesQueryDTO {
  @IsString()
  institutionId: string;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  take?: number = 10;
}
