import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('AdminApproved', { orderBy: { id: 'ASC' } })
export class Activity {
  @PrimaryGeneratedColumn()
  public adminapprovedid: number;

  @ManyToOne(
    type => User,
    User => User.userid,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public user: User | null;
}
