import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  EmailCheckReqBodyDto,
  SignInReqBodyDto,
  SignUpReqBodyDto,
} from './dto/auth-req.dto';
import { User } from 'src/user/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('email-check')
  async emailCheck(
    @Body() body: EmailCheckReqBodyDto,
  ): Promise<{ email: string; isAvailable: boolean }> {
    return this.authService.emailCheck(body);
  }

  @Post('sign-up')
  async signUp(@Body() body: SignUpReqBodyDto): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    return this.authService.signUp(body);
  }

  @Post('sign-in')
  async signIn(@Body() body: SignInReqBodyDto): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    return this.authService.signIn(body);
  }
  // Refresh Token

  // oauth / kakao
}
