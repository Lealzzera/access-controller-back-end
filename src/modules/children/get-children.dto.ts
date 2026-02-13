import { IsNotEmpty, IsString } from 'class-validator';

export class GetChildrenDTO {
  @IsString({
    message: 'Institution ID must be a string',
  })
  @IsNotEmpty({ message: 'Institution ID must be provided' })
  institutionId: string;
}
