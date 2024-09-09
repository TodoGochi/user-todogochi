import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  EmailCheckReqBodyDto,
  SignInReqBodyDto,
  SignUpReqBodyDto,
} from './dto/auth-req.dto';
import { User } from 'src/user/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
const logger = new Logger('AuthController');
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
  async emailSignIn(@Body() body: SignInReqBodyDto): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    return this.authService.emailSignIn(body);
  }

  @Get('sign-in/kakao')
  @UseGuards(AuthGuard('kakao'))
  async signInKakao(@Query('code') code: string, @Req() req: Request) {
    logger.log('req.user :: ' + req.user);
    return this.authService.signInKakao(req);
  }
}
