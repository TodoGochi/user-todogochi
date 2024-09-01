import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { SignUpType } from "../constant/sign-up.enum";

export class SignUpReqBodyDto {
  @IsEmail()
  email: string;

  @IsEnum(SignUpType)
  type: SignUpType;

  @IsOptional()
  @IsString()
  password: string;

  
}