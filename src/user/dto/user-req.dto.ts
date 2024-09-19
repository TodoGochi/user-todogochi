import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class UserIdReqParamDto {
  @Type(() => Number)
  @IsInt()
  userId: number;
}

export class CreateCoinTransactionReqBodyDto {
  @Type(() => Number)
  @IsInt()
  userId: number;

  @Type(() => Number)
  @IsInt()
  changeAmount: number;

  @IsString()
  description: string;
}
