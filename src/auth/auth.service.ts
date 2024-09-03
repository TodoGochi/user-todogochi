import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Config } from 'src/common/environment/config';
import * as argon2 from 'argon2';
import { UserService } from 'src/user/user.service';
import { ApiError } from 'src/common/error/api.error';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async generateTokens(userId: number, email: string) {
    const jwtConfig = Config.getEnvironment().JWT;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: jwtConfig.accessSecret,
          expiresIn: jwtConfig.accessExpiresIn,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: jwtConfig.refreshSecret,
          expiresIn: jwtConfig.refreshExpiresIn,
        },
      ),
    ]);
    await this.userService.saveRefreshToken(
      userId,
      await argon2.hash(refreshToken),
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string, userId: number) {
    const user = await this.userService.getOneByPk(userId);
    if (!user || !user.refreshToken?.token) {
      throw new ApiError('USER-0003');
    }
    const refreshTokenMatched = await argon2.verify(
      user.refreshToken.token,
      refreshToken,
    );
    if (!refreshTokenMatched) {
      throw new ApiError('USER-0003');
    }
    const tokens = await this.generateTokens(user.userId, user.email);

    return tokens;
  }
}
