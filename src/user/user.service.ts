import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { User } from './entity/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { CoinTransactionRepository } from './repository/coin-transaction.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly authService: AuthService,
    private readonly coinTransactionRepository: CoinTransactionRepository,
  ) {}

  async getUserByPk(userId: number): Promise<User> {
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

  async getCoinTransactionByUserId(userId: number) {
    return this.coinTransactionRepository.getAllByUserId(userId);
  }
}
