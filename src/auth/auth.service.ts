import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Config } from 'src/common/environment/config';
import { UserService } from 'src/user/user.service';
import { ApiError } from 'src/common/error/api.error';
import { User } from 'src/user/entity/user.entity';
import * as argon2 from 'argon2';
import { SignUpType } from 'src/user/constant/sign-up.enum';
import { Request } from 'express';

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
        },
        {
          secret: jwtConfig.accessSecret,
          expiresIn: jwtConfig.accessExpiresIn,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: jwtConfig.refreshSecret,
          expiresIn: jwtConfig.refreshExpiresIn,
        },
      ),
    ]);
    await this.userService.saveRefreshToken(userId, refreshToken);

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
    if (user.refreshToken.token !== refreshToken) {
      throw new ApiError('USER-0003');
    }
    const tokens = await this.generateTokens(user.userId, user.email);

    return tokens;
  }

  async signUp(input: {
    nickName: string;
    password: string;
    email?: string;
    oauthId?: string;
    signUpType?: SignUpType;
  }): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    const isExistEmail = await this.userService.getOneByEmail(input.email);
    if (isExistEmail) {
      throw new ApiError('USER-0001');
    }
    const hashedPassword = await argon2.hash(input.password);
    const user = await this.userService.createUser({
      email: input.email,
      nickName: input.nickName,
      oauthId: input.oauthId,
      signUpType: input.signUpType || SignUpType.EMAIL,
      password: hashedPassword,
    });
    const tokens = await this.generateTokens(user.userId, user.email);
    delete user.password;

    return { user, tokens };
  }

  async emailSignIn(input: { email: string; password: string }): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    const user = await this.userService.getOneByEmail(input.email);
    if (!user) {
      throw new ApiError('USER-0004');
    }
    const passwordMatched = await argon2.verify(user.password, input.password);
    if (!passwordMatched) {
      throw new ApiError('USER-0002');
    }
    const tokens = await this.generateTokens(user.userId, user.email);
    delete user.password;

    return { user, tokens };
  }

  async oauthSignIn(input: { oauthId: string }): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    const user = await this.userService.getOneByOauthId(input.oauthId);
    if (!user) {
      throw new ApiError('USER-0004');
    }
    const tokens = await this.generateTokens(user.userId, user.email);
    delete user.password;

    return { user, tokens };
  }

  async emailCheck(input: { email: string }) {
    const isExistEmail = await this.userService.getOneByEmail(input.email);
    const isAvailable = !isExistEmail;

    return { email: input.email, isAvailable };
  }

  async signInKakao() {
    const kakaoClientId = Config.getEnvironment().KAKAO_AUTH.clientId;
    const redirectUri = Config.getEnvironment().KAKAO_AUTH.redirectUri;
    const redirectUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${redirectUri}&response_type=code`;

    return redirectUrl;
  }

  async kakaoAuthCallback(req: any) {
    const kakaoUserProfile = req.user;
    const isExistUser = await this.userService.getOneByOauthId(
      String(kakaoUserProfile.oauthId),
    );
    if (!isExistUser) {
      const user = await this.signUp({
        nickName: kakaoUserProfile.name,
        password: String(kakaoUserProfile.oauthId),
        oauthId: String(kakaoUserProfile.oauthId),
        signUpType: SignUpType.KAKAO,
      });

      return user;
    }
    return this.oauthSignIn({ oauthId: String(kakaoUserProfile.oauthId) });
  }
}
