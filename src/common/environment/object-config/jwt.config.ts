import { IsString } from 'class-validator';

export class JwtConfig {
  @IsString()
  accessSecret: string;

  @IsString()
  accessExpiresIn: string;

  @IsString()
  refreshSecret: string;

  @IsString()
  refreshExpiresIn: string;
}
