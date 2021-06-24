import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	Unique,
	OneToMany,

} from "typeorm";

import { Course } from "./course.entity";

@Entity('CourseStatus', {orderBy: {statusid: 'ASC'}})
export class CourseStatus {
	@PrimaryGeneratedColumn()
	public statusid: number;

	@Column()
	status: string;

	@OneToMany(
		type => Course,
		Course => Course.courseid,
		{
			onDelete: 'RESTRICT',
			onUpdate: 'RESTRICT',
		},
	)
	public course: Course | null;
}
