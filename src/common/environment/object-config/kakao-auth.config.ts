import { IsString } from 'class-validator';

export class KakaoAuthConfig {
  @IsString()
  clientId: string;

  @IsString()
  clientSecret: string;

  @IsString()
  redirectUri: string;
}
