import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateCoinTransactionReqBodyDto,
  UserIdReqParamDto,
} from './dto/user-req.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  async getUserByPk(@Param() params: UserIdReqParamDto) {
    return this.userService.getUserByPk(params.userId);
  }

  @Get(':userId/coin-transactions')
  async getCoinTransactionByUserId(@Param() params: UserIdReqParamDto) {
    return this.userService.getCoinTransactionsByUserId(params.userId);
  }

  @Post(':userId/coin-transactions')
  async createCoinTransaction(
    @Param() params: UserIdReqParamDto,
    @Body() body: CreateCoinTransactionReqBodyDto,
  ) {
    return this.userService.createCoinTransactions({
      userId: params.userId,
      ...body,
    });
  }
}
