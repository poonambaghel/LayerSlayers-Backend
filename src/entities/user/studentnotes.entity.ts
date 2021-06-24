import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToOne,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Lecture } from './lecture.entity';
import { User } from './user.entity';

@Entity('StudentNotes', { orderBy: { createdAt: 'ASC' } })
export class StudentNotes {
  @PrimaryGeneratedColumn()
  public studentnotesid: number;

  @Column()
  description: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public createdAt: string;

  @ManyToOne(
    type => Lecture,
    Lecture => Lecture.lectureid,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public lecture: Lecture | null;

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
