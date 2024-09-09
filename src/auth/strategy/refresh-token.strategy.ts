import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Config } from 'src/common/environment/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        if (req.body && req.body.oldRefreshToken) {
          return req.body.oldRefreshToken;
        }
        throw new UnauthorizedException(
          'Refresh token not found in request body',
        );
      },
      secretOrKey: Config.getEnvironment().JWT.refreshSecret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.body.oldRefreshToken; // body에서 refreshToken 확인
    return { ...payload, refreshToken };
  }
}
