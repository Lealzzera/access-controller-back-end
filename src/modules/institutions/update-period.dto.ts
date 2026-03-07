import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePeriodDTO {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name must be provided' })
  name: string;
}
