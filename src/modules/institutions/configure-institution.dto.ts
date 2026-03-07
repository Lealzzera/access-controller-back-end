import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ConfigureInstitutionDTO {
  @IsString({ message: 'Institution ID must be a string' })
  @IsNotEmpty({ message: 'Institution ID must be provided' })
  institutionId: string;

  @IsArray({ message: 'Periods must be an array' })
  @IsString({ each: true, message: 'Each period must be a string' })
  periods: string[];

  @IsArray({ message: 'Grades must be an array' })
  @IsString({ each: true, message: 'Each grade must be a string' })
  grades: string[];
}
