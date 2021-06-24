import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('UserStatus', { orderBy: { userstatusid: 'ASC' } })
export class UserStatus {
  @PrimaryGeneratedColumn()
  public userstatusid: number;

  @Column({ nullable: true, type: 'varchar' })
  public name: string | null;

  @OneToMany(
    type => User,
    User => User.userStatus,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public users: User[];
}



