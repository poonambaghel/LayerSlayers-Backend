import express from 'express';

import courseController from '../../controllers/course.controller';
import courseSchema from '../../constants/schema/course.schema';

const router = express.Router();

const schemaValidator = require('express-joi-validator');

router.get(
	'/admin/approvedCourses',
	courseController.courseList);

router.get(
	'/admin/pendingCourses',
	courseController.pendingCourse);

router.post(
	'/admin/course/approve',
	courseController.approveCourse);

router.get(
	`/instructor/courses/:userid`,
	courseController.getCourseByInstructor);
	
router.get(
	`/instructor/categories/:userid`,
	courseController.getCategoryByInstructor);

router.get(
	`/categories/all/:userid`,
	 courseController.getCategories);

router.get(
	'/categories/all',
	courseController.getStudentCategories);

router.get(
	`/instructor/categories/:userid`,
	courseController.getCategoriesofInstructor);

router.get(
	`/instructor/sections/:userid`,
	courseController.getSectionByInstructor);

router.get(
	`/instructor/lectures/:userid`,
	courseController.getLectureByInstructor);

router.post(
	'/admin/addCategory',
	courseController.addCategory);

router.post(
	'/instructor/addCourse',
	courseController.addCourse);	

router.post(
	'/instructor/addSection',
	courseController.addSection);

router.post(
	'/instructor/addLecture',
	courseController.addLecture);

router.post(
	'/student/enroll',
	courseController.courseEnroll);

router.get(
	`/student/:userid/enrolled`,
	courseController.fetchEnrolledCourses);

router.get(
	`/instructor/:userid/course/:courseid`,
	courseController.getInstructorLectureByCourse);

router.get(
	`/student/:userid/course/:courseid`,
	courseController.getLectureByCourse);

router.get(
	`/student/course/section/:courseid`,
	courseController.getSectionByCourse);

router.get(
	`/student/course/section/lec/:sectionid`,
	courseController.getLectureBySection);

router.get(
	`/instructor/category/:categoryid/courses`,
	courseController.getCourseByCategories);


router.get(
	`/student/allcourses/:userid`,
	courseController.showAllCourses);	

router.put(
	`/instructor/:userid/crs/:courseid/editCourseDetails`,
	courseController.updateCourseInfo);

router.put(
	`/instructor/:userid/crs/:courseid/sc/:sectionid/editSectionDetails`,
	courseController.updateSectionInfo);

router.put(
	`/instructor/:userid/sc/:sectionid/lc/:lectureid/editLectureDetails`,
	courseController.updateLectureInfo);

router.put(
	`/instructor/:userid/removeLecture`,
	courseController.removeLecture);

router.put(
	`/admin/:userid/removeCourse`,
	courseController.removeCourse);

router.get(
	`/instructor/:userid/myCourses`,
	courseController.showMyCourseStatus);

router.post(
	'/student/mycourse/lecture/notes',
	courseController.addStudentNotes);

router.put(
	`/student/:userid/lec/:lec/note/:note`,
	courseController.editStudentNotes);


router.get(
	`/student/:userid/lec/:lectureid/notes`,
	courseController.returnStudentNotes);


router.get(
	`/instructor/:userid/category/:categoryid/courses`,
	courseController.getInstructorCourseByCategories);

router.delete(
	`/student/notes/delete/:studentnotesid`,
	courseController.deleteStudentNotes	
	);
	
router.delete(
	`/delete/course/:courseid`,
	courseController.deleteCourses	
	);	

router.delete(
	`/delete/lecture/:lectureid`,
	courseController.deleteLecture	
	);	

router.delete(
	`/delete/section/:sectionid`,
	courseController.deleteSection	
	);	


router.post(
	'/admin/course/type',
	courseController.changeCourseType
	);


router.delete(
	`/delete/student/:userid/course/:courseid`,
	courseController.studentUnenroll
	);

router.get(
	`/instructor/courseenroll/:userid`,
	courseController.countStudentsPerCourse);


export default router;