import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { ApiError } from 'src/common/error/api.error';
import { User } from './entity/user.entity';
import * as argon2 from 'argon2';
import { SignUpType } from './constant/sign-up.enum';
import { AuthService } from 'src/auth/auth.service';
import { RefreshTokenRepository } from './repository/refresh-token.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly authService: AuthService,
  ) {}

  async getOneByPk(userId: number): Promise<User> {
    return this.userRepository.getOneByPk(userId);
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    return this.refreshTokenRepository.save({ userId, token: refreshToken });
  }

  async getOneByEmail(email: string): Promise<User> {
    if (!email) {
      return null;
    }
    return this.userRepository.getOneByEmail(email);
  }

  async createUser(input: Partial<User>) {
    return this.userRepository.create(input);
  }

  async getOneByOauthId(oauthId: string) {
    return this.userRepository.getOneByOauthId(oauthId);
  }
}
