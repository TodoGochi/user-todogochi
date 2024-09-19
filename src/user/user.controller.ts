import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserIdReqParamDto } from './dto/user-req.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  async getUserByPk(@Param() params: UserIdReqParamDto) {
    return this.userService.getUserByPk(params.userId);
  }

  @Get(':userId/coin-transaction')
  async getCoinTransactionByUserId(@Param() params: UserIdReqParamDto) {
    return this.userService.getCoinTransactionByUserId(params.userId);
  }
}
