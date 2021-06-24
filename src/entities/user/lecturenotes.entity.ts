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

@Entity('LectureNotes', { orderBy: { id: 'ASC' } })
export class LectureNotes {
  @PrimaryGeneratedColumn()
  public lecturenotesid: number;

  @Column()
  notes: string;

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
