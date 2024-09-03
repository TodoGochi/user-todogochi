import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { ApiError } from 'src/common/error/api.error';
import { User } from './entity/user.entity';
import * as argon2 from 'argon2';
import { SignUpType } from './constant/sign-up.enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(input: {
    email: string;
    signUpType: SignUpType;
    password?: string;
  }): Promise<User> {
    const isExistEmail = await this.userRepository.getOneByEmail(input.email);
    if (isExistEmail) {
      throw new ApiError('USER-0001');
    }
    if (input.signUpType === SignUpType.EMAIL && !input.password) {
      throw new ApiError('USER-0002');
    }
    const hashedPassword = await argon2.hash(input.password);
    const user = await this.userRepository.create({
      email: input.email,
      signUpType: input.signUpType,
      password: hashedPassword,
    });

    return user;
  }

  async emailCheck(input: {
    email: string;
  }): Promise<{ email: string; isAvailable: boolean }> {
    const isExistEmail = await this.userRepository.getOneByEmail(input.email);
    const isAvailable = !isExistEmail;

    return { email: input.email, isAvailable };
  }
}
