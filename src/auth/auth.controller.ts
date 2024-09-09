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
  RefreshAccessTokenReqBodyDto,
  SignInReqBodyDto,
  SignUpReqBodyDto,
} from './dto/auth-req.dto';
import { User } from 'src/user/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { RefreshTokenGuard } from 'src/common/core/guards/refresh-token.guard';

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

  @Post('sign-in/kakao')
  @UseGuards(AuthGuard('kakao'))
  async signInKakao(@Query('code') code: string, @Req() req: Request) {
    return this.authService.signInKakao(req);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async RefreshAccessToken(
    @Req() req: Request,
    @Body() body: RefreshAccessTokenReqBodyDto,
  ) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(refreshToken, userId);
  }
}
