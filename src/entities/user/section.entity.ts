import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToOne,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Course } from './course.entity';
import { Lecture } from './lecture.entity';
import { User } from './user.entity';

@Entity('Section', { orderBy: { sectionid : 'ASC' } })
export class Section {
  @PrimaryGeneratedColumn()
  public sectionid: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public createdAt: string;

  @ManyToOne(
    type => Course,
    Course => Course.courseid,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public course: Course | null;

  @OneToMany(
    type => Lecture,
    Lecture => Lecture.section,
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
