import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { ApiError } from 'src/common/error/api.error';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(input: {
    email: string;
    type: string;
    password?: string;
  }): Promise<User> {
    const isExistEmail = await this.userRepository.getOneByEmail(input.email);
    if (isExistEmail) {
      throw new ApiError('USER-0001');
    }
    if (input.type === 'EMAIL' && !input.password) {
      throw new ApiError('USER-0002');
    }
    const user = await this.userRepository.create(input);
    return user;
  }
}
