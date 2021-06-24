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
import { User } from './user.entity';

@Entity('CourseEnrolled', { orderBy: { courseenrolledid: 'ASC' } })
export class CourseEnrolled {
  @PrimaryGeneratedColumn()
  public courseenrolledid: number;

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
