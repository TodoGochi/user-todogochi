import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import {
  EmailCheckReqBodyDto,
  SignInReqBodyDto,
  SignUpReqBodyDto,
} from './dto/user-req.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('email-check')
  async emailCheck(
    @Body() body: EmailCheckReqBodyDto,
  ): Promise<{ email: string; isAvailable: boolean }> {
    return this.userService.emailCheck(body);
  }

  @Post('sign-up')
  async signUp(@Body() body: SignUpReqBodyDto): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    return this.userService.signUp(body);
  }

  @Post('sign-in')
  async signIn(@Body() body: SignInReqBodyDto): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    return this.userService.signIn(body);
  }
}
