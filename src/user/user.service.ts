import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { User } from './entity/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { CoinTransactionRepository } from './repository/coin-transaction.repository';
import { ApiError } from 'src/common/error/api.error';

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

  async getCoinTransactionsByUserId(userId: number) {
    return this.coinTransactionRepository.getAllByUserId(userId);
  }

  async createCoinTransactions(input: {
    userId: number;
    changeAmount: number;
    description: string;
  }) {
    const user = await this.getUserByPk(input.userId);
    if (!user) {
      throw new ApiError('USER-0004');
    }
    if (user.coin + input.changeAmount < 0) {
      throw new ApiError('USER-0005');
    }
    user.coin += input.changeAmount;
    await this.userRepository.update(user);
    const coinTransaction = await this.coinTransactionRepository.create({
      user,
      changeAmount: input.changeAmount,
      description: input.description,
      coin: user.coin,
    });
    delete coinTransaction.user.refreshToken;

    return coinTransaction;
  }
}
