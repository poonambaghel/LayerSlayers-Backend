import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Course } from './course.entity';
import { Lecture } from './lecture.entity';
import { Section } from './section.entity';
import { CourseEnrolled } from './courseenrolled.entity';
import { UserStatus } from './userstatus.entity';
import { UserType } from './usertype.entity';
import { StudentNotes } from './studentnotes.entity';
// import { UserAuthStatus } from './userauthstatus.entity';

@Entity('User', { orderBy: { userid: 'ASC' } })
export class User {
  @PrimaryGeneratedColumn()
  public userid: number;

  @Column()
  name: string;

  @Column({nullable: true})
  username: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  Suggestedby: string;

  @Column({nullable: true })
  suggestedBy_id: number;

  @Column({ nullable: true })
  SuggestionDescription: string;

  @Column()
  password: string;

  @Column({ default: false })
  paid: boolean;

  @Column({ default: false })
  is_ban: boolean;

  @Column({ default: false })
  is_pending: boolean;

  @Column({ default: false })
  is_verified: boolean;

  @Column({nullable : true})
  prevType: number;

  
  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: string | Date;

  @Column({ nullable: true, type: 'timestamp' })
  public lastLogin: string | Date;

  @ManyToOne(
    type => UserType,
    UserType => UserType.users,
    {
      onDelete: 'RESTRICT',//'CASCADE'
      onUpdate: 'RESTRICT',
    },
  )
  public userType: UserType | null;

  @ManyToOne(
    type => UserStatus,
    UserStatus => UserStatus.users,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public userStatus: UserStatus | null;

  @OneToMany(
    type => Course,
    Course => Course.user,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public course: Course | null;

  @OneToMany(
    type => Section,
    Section => Section.user,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public section: Section | null;

  @OneToMany(
    type => Lecture,
    Lecture => Lecture.user,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public lecture: Lecture | null;

  @OneToMany(
    type => CourseEnrolled,//table class
    CourseEnrolled => CourseEnrolled.user, //cloumn
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public userEnrolled: CourseEnrolled | null;

  @OneToMany(
    type => CourseEnrolled,
    CourseEnrolled => CourseEnrolled.course,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public courseEnrolled: CourseEnrolled | null;

  @OneToMany(
    type => StudentNotes,
    StudentNotes => StudentNotes.user,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public studentNotes: StudentNotes | null;

  // @OneToOne(
  //   type => UserAuthStatus,
  //   UserAuthStatus => UserAuthStatus.userauthstatusid,
  //   {
  //     onDelete: 'CASCADE',
  //     onUpdate: 'CASCADE',
  //   },
  // )
}


