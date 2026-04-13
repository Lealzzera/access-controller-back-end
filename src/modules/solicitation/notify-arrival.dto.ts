import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum ArrivalAlertType {
  MINUTES_30 = 'MINUTES_30',
  MINUTES_15 = 'MINUTES_15',
}

export class NotifyArrivalDTO {
  @IsEnum(ArrivalAlertType, {
    message: 'minutes must be MINUTES_30 or MINUTES_15',
  })
  @IsNotEmpty()
  minutes: ArrivalAlertType;

  @IsString()
  @IsNotEmpty()
  childId: string;
}
