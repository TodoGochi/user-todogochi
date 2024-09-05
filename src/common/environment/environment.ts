import { Type, plainToClass } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsNumberString,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DatabaseConfig } from './object-config/database.config';
import { JwtConfig } from './object-config/jwt.config';
import { KakaoAuthConfig } from './object-config/kakao-auth.config';

export class Environment {
  @IsIn(['production', 'test', 'development'])
  NODE_ENV = process.env.NODE_ENV;

  @IsString()
  SERVICE_NAME = process.env.SERVICE_NAME;

  @IsNumberString()
  PORT = process.env.SERVICE_PORT;

  // Database
  @ValidateNested()
  @Type(() => DatabaseConfig)
  DATABASE: DatabaseConfig = plainToClass(DatabaseConfig, {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
  });

  // JWT
  @ValidateNested()
  @Type(() => JwtConfig)
  JWT: JwtConfig = plainToClass(JwtConfig, {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

  // Kakao Auth
  @ValidateNested()
  @Type(() => KakaoAuthConfig)
  KAKAO_AUTH: KakaoAuthConfig = plainToClass(KakaoAuthConfig, {
    clientId: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    redirectUri: process.env.KAKAO_REDIRECT_URI,
  });
}
