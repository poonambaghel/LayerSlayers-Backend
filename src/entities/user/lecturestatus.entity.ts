import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	Unique,
	OneToMany,

} from "typeorm";

import { Lecture } from "./lecture.entity";

@Entity('LectureStatus', {orderBy: {statusid: 'ASC'}})
export class LectureStatus {
	@PrimaryGeneratedColumn()
	public statusid: number;

	@Column()
	status: string;

	@OneToMany(
		type => Lecture,
		Lecture => Lecture.lectureid,
		{
			onDelete: 'RESTRICT',
			onUpdate: 'RESTRICT',
		},
	)
	public lecture: Lecture | null;
}
