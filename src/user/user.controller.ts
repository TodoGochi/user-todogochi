import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { GetUserByPkReqParamDto } from './dto/user-req.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  async getUserByPk(params: GetUserByPkReqParamDto) {
    return this.userService.getUserByPk(params.userId);
  }
}
