import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SolicitationType } from '@prisma/client';

export class CreateSolicitationDTO {
  @IsEnum(SolicitationType, { message: 'Type must be DROP_OFF or PICK_UP' })
  @IsNotEmpty({ message: 'Type must be provided' })
  type: SolicitationType;

  @IsString({ message: 'Child ID must be a string' })
  @IsNotEmpty({ message: 'Child ID must be provided' })
  childId: string;
}
