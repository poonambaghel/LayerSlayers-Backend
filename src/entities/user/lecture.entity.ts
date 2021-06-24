import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToOne,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Activity } from './activity.entity';
import { LectureNotes } from './lecturenotes.entity';
import { Section } from './section.entity';
import { StudentNotes } from './studentnotes.entity';
import { User } from './user.entity';
import { LectureStatus } from './lecturestatus.entity';

@Entity('Lecture', { orderBy: { lectureid: 'ASC' } })
export class Lecture {
  @PrimaryGeneratedColumn()
  public lectureid: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  link: string;

  @Column()
  distLink: string;


  @Column({ nullable: true })
  duration: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public createdAt: string;

  @OneToMany(
    type => StudentNotes,
    StudentNotes => StudentNotes.lecture,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public studentNotes: StudentNotes | null;

  @OneToMany(
    type => LectureNotes,
    LectureNotes => LectureNotes.lecture,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public lectureNotes: LectureNotes | null;

  @OneToMany(
    type => Activity,
    Activity => Activity.lecture,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public activity: Activity | null;

  @ManyToOne(
    type => Section,
    Section => Section.sectionid,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  public section: Section | null;

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
    type => LectureStatus,
    LectureStatus => LectureStatus.status,
    {
      onDelete:'RESTRICT',
      onUpdate:'RESTRICT',
    },
  )
  public lectureStatus: LectureStatus | null;
}
