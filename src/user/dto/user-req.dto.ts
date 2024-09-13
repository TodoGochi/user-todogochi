import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetUserByPkReqParamDto {
  @Type(() => Number)
  @IsInt()
  userId: number;
}
