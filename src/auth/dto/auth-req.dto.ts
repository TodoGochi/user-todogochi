import { IsEmail, IsString } from 'class-validator';

export class SignUpReqBodyDto {
  @IsEmail()
  email: string;

  @IsString()
  nickName: string;

  @IsString()
  password: string;
}

export class EmailCheckReqBodyDto {
  @IsEmail()
  email: string;
}

export class SignInReqBodyDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
