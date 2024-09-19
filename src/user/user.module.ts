import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { RefreshToken } from './entity/refresh-token.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { CoinTransaction } from './entity/coin-transaction.entity';
import { CoinTransactionRepository } from './repository/coin-transaction.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken, CoinTransaction]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    RefreshTokenRepository,
    CoinTransactionRepository,
  ],
  exports: [UserService],
})
export class UserModule {}
