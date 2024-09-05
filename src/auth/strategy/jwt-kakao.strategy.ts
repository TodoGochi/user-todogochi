import { ConsoleLogger, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { Config } from 'src/common/environment/config';

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: Config.getEnvironment().KAKAO_AUTH.clientId,
      clientSecret: Config.getEnvironment().KAKAO_AUTH.clientSecret,
      callbackURL: Config.getEnvironment().KAKAO_AUTH.redirectUri,
      scope: ['profile_nickname'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    return {
      name: profile.displayName,
      oauthId: profile.id,
      password: profile.id,
    };
  }
}
