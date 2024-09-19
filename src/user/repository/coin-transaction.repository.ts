import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinTransaction } from '../entity/coin-transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CoinTransactionRepository {
  constructor(
    @InjectRepository(CoinTransaction)
    private readonly coinTransactionRepository: Repository<CoinTransaction>,
  ) {}

  async create(data: Partial<CoinTransaction>) {
    return this.coinTransactionRepository.save(data);
  }

  async getAllByUserId(userId: number) {
    return this.coinTransactionRepository.find({ where: { user: { userId } } });
  }
}
