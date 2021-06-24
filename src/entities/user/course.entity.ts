import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToOne,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { Section } from './section.entity';
import { User } from './user.entity';
import { CourseStatus } from './coursestatus.entity';
import { CourseEnrolled } from './courseenrolled.entity';

@Entity('Course', { orderBy: { courseid: 'ASC' } })
export class Course {
  @PrimaryGeneratedColumn()
  public courseid: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: false })
  approved: boolean;

  @Column({ default: true })
  pending: boolean;

  @Column({ nullable: true})
  adminComment: string;

  @Column({default: 'free'})
  coursetype: string;

  @Column({ nullable: true })
  courseImage : string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public createdAt: string;

  @OneToMany(
    type => Section,
    Section => Section.course,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public section: Section | null;

  @ManyToOne(
    type => Category,
    Category => Category.course,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public category: Category | null;

  @ManyToOne(
    type => User,
    User => User.userid,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public user: User | null;

  @ManyToOne(
    type => CourseStatus,
    CourseStatus => CourseStatus.status,
    {
      onDelete:'RESTRICT',
      onUpdate:'RESTRICT',
    },
  )
  public courseStatus: CourseStatus | null;

}
