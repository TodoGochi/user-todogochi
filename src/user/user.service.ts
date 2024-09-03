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

  async signUp(input: {
    email: string;
    nickName: string;
    signUpType: SignUpType;
    password?: string;
  }): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
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
      nickName: input.nickName,
      signUpType: input.signUpType,
      password: hashedPassword,
    });
    const tokens = await this.authService.generateTokens(
      user.userId,
      user.email,
    );
    delete user.password;

    return { user, tokens };
  }

  async signIn(input: { email: string; password: string }): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    const user = await this.userRepository.getOneByEmail(input.email);
    if (!user) {
      throw new ApiError('USER-0003');
    }
    const passwordMatched = await argon2.verify(user.password, input.password);
    if (!passwordMatched) {
      throw new ApiError('USER-0004');
    }
    const tokens = await this.authService.generateTokens(
      user.userId,
      user.email,
    );
    delete user.password;

    return { user, tokens };
  }

  async emailCheck(input: {
    email: string;
  }): Promise<{ email: string; isAvailable: boolean }> {
    const isExistEmail = await this.userRepository.getOneByEmail(input.email);
    const isAvailable = !isExistEmail;

    return { email: input.email, isAvailable };
  }

  async getOneByPk(userId: number): Promise<User> {
    return this.userRepository.getOneByPk(userId);
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    return this.refreshTokenRepository.save({ userId, token: refreshToken });
  }
}
