import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { SignUpType } from '../constant/sign-up.enum';

export class SignUpReqBodyDto {
  @IsEmail()
  email: string;

  @IsString()
  nickName: string;

  @IsEnum(SignUpType)
  signUpType: SignUpType;

  @IsOptional()
  @IsString()
  password: string;
}

export class EmailCheckReqBodyDto {
  @IsEmail()
  email: string;
}
