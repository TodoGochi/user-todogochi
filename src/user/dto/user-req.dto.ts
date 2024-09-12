import { IsInt } from 'class-validator';

export class GetUserByPkReqParamDto {
  @IsInt()
  userId: number;
}
