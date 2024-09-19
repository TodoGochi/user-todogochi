import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class UserIdReqParamDto {
  @Type(() => Number)
  @IsInt()
  userId: number;
}
