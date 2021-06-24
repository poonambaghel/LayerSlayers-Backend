import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity('UserType', { orderBy: { usertypeid: 'ASC' } })
export class UserType {
  @PrimaryGeneratedColumn()
  public usertypeid: number;

  @Column({ nullable: true, type: 'varchar' })
  public name: string | null;

  @OneToMany(
    type => User,
    User => User.userType,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public users: User[];
}
