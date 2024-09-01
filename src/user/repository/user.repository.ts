import { Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(data: Partial<User>) {
    return this.userRepository.save(data);
  }

  async getOneByPk(userId: number) {
    return this.userRepository.findOne({ where: { userId } });
  }

  async getOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
