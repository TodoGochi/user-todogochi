import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SignUpType } from '../constant/sign-up.enum';
import { RefreshToken } from './refresh-token.entity';
import { UserRole } from '../constant/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ nullable: true, name: 'oauth_id' })
  oauthId: string;

  @Column({
    type: 'enum',
    enum: SignUpType,
    name: 'sign_up_type',
  })
  signUpType: SignUpType;

  @Column({ name: 'nick_name' })
  nickName: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user, {
    eager: true,
  })
  refreshToken: RefreshToken;
}
