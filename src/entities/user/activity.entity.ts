import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Lecture } from './lecture.entity';

@Entity('Activity', { orderBy: { id: 'ASC' } })
export class Activity {
  @PrimaryGeneratedColumn()
  public activityid: number;

  @Column()
  views: number;

  @ManyToOne(
    type => Lecture,
    Lecture => Lecture.lectureid,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public lecture: Lecture | null;
}
