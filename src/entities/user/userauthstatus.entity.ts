import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';


@Entity('UserAuthStatus', { orderBy: {userauthstatusid : 'ASC'}})
export class UserAuthStatus {
  @PrimaryGeneratedColumn()
  public userauthstatusid: number;

  @Column({default:false})
  is_verified: boolean;

  @Column()
  verifyToken:string;

  @OneToOne(
    type => User,
    User => User.userid,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  public users: User[];
}