import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entity/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly userRepository: Repository<RefreshToken>,
  ) {}

  async save(data: Partial<RefreshToken>) {
    return this.userRepository.save(data);
  }
}
