import httpStatusCodes from 'http-status-codes';
import { Course } from '../entities/user/course.entity';
//import courseService from '../services/course.service';
import IController from '../types/IController';
import apiResponse from '../utilities/apiResponse';
import { generateCookie } from '../utilities/encryptionUtils';
import constants from '../constants';
import locale from '../constants/locale';
import courseService from '../services/course.service';
import { Context } from 'node:vm';

const courseList: IController = async (req, res) => {
  let course;
  try {
    course = await courseService.approveCourseList();
    if (course) {
      apiResponse.result(res, course, httpStatusCodes.CREATED, null);
    } else {
      apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
    }
  } catch (e) {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
};


const changeCourseType: IController = async(req, res) => {
  let course;
  try {
    course = await courseService.changeCourseType(req.body.courseid);
    if (course) {
      apiResponse.result(res, course, httpStatusCodes.CREATED, null);
    } else {
      apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
    }
  } catch (e) {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}


const pendingCourse: IController = async (req, res) => {
  let course;
  try {
    course = await courseService.pendingCourse();
    if (course) {
      apiResponse.result(res, course, httpStatusCodes.CREATED, null);
    } else {
      apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
    }
  } catch (e) {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
};

const approveCourse: IController = async (req, res) => {
  let result;
  result = await courseService.approveCourse(
    req.body.courseid,
    req.body.approve,
    req.body.adminComment
  );

  const final = { decision: result };
  if (result == 1) {
    apiResponse.result(res, final, httpStatusCodes.OK, null);
  } else if (result == 0) {
    apiResponse.result(res, final, httpStatusCodes.OK, null);
  } 
  else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
};




const getCourseByInstructor: IController = async (req, res) => {
  let result;
  result = await courseService.getCourseByInstructor(req.params.userid);
  console.log('RESULT ', result);
  const final = { decision: result };
  if (result) {
    apiResponse.result(res, final, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
};

const getCategoryByInstructor: IController = async (req, res) => {
  let result;
  result = await courseService.getCategoryByInstructor(req.params.userid);
  console.log('RESULT ', result);
  const final = { decision: result };
  if (result) {
    apiResponse.result(res, final, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
};


const getCategoriesofInstructor:IController = async(req, res) => {
  let result;
  result = await courseService.getCategoriesofInstructor(req.params.userid);
  const final = {decision: result};
  if (result) {
    apiResponse.result (res, final, httpStatusCodes.OK, null);
  }
  else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}

const getCategories: IController = async (req, res) => {
  let category;
  try {
    category = await courseService.getCategories(req.params.userid);
    if (category) {
      apiResponse.result(res, category, httpStatusCodes.CREATED, null);
    } else {
      apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
    }
  } catch (e) {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
};



const getCourseByCategories: IController = async (req, res) => {
  let course;
  try {
    course = await courseService.getCourseByCategories(req.params.categoryid);
    if (course) {
      apiResponse.result(res, course, httpStatusCodes.OK, null);
    }
    else {
      apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
    }
  } catch (e) {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}

const getSectionByInstructor: IController = async (req, res) => {
  let result;
  result = await courseService.getSectionByInstructor(req.params.userid);
  console.log('RESULT ', result);
  const final = { decision: result };
  if (result) {
    apiResponse.result(res, final, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
};



const getSectionByCourse: IController = async(req, res) => {
  let result;
  result = await courseService.getSectionByCourse(req.params.courseid);
  if (result) {
    apiResponse.result(res, result, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}



const getLectureBySection: IController = async(req, res) => {
  let result;
  result = await courseService.getLectureBySection(req.params.sectionid);
  if (result) {
    apiResponse.result(res, result, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}






const getLectureByInstructor: IController = async (req, res) => {
  let result;
  result = await courseService.getLectureByInstructor(req.params.userid);
  console.log('RESULT ', result);
  const final = { decision: result };
  if (result) {
    apiResponse.result(res, final, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
};

const showAllCourses:IController = async (req, res) => {
  let result;
  //console.log(req.params, 'params');
  result = await courseService.showAllCourses(req.params.userid);
  //console.log('SHOW ALL COURSES', result);
  const final = { decision: result };
  if (result) {
    apiResponse.result(res, final, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
};


const updateCourseInfo:IController = async(req, res) => {
  let result, res1;
  result = await courseService.updateCourseInfo(req.params.userid, req.params.courseid, req.body);
  if (result) {
    res1 = {'result':'true'};
    apiResponse.result(res, res1, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }

}




const updateSectionInfo:IController = async(req, res) => {
  let result, res1;
  result = await courseService.updateSectionInfo(req.params.userid, req.params.courseid,req.params.sectionid, req.body);
  if (result) {
    res1 = {'result':'true'};
    apiResponse.result(res, res1, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }

}



const updateLectureInfo:IController = async (req, res) => {
  let result, res1;
  result = await courseService.updateLectureInfo(req.params.userid,req.params.sectionid, req.params.lectureid, req.body);
  if (result) {
    res1 = {'result':'true'};
    apiResponse.result(res, res1, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}





const removeCourse: IController = async(req, res) => {
  let result, res1;
  result = await courseService.removeCourse(req.params.userid, req.body.courseid);
  if (result) {
    apiResponse.result(res, result, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}



const showMyCourseStatus: IController = async (req, res) => {
  console.log('abcdef');
  let courses;
  courses = await courseService.showMyCourseStatus(req.params.userid);
  if (courses) {
    apiResponse.result(res, courses, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}







const removeLecture: IController = async(req, res) => {
  let result, res1;
  result = await courseService.removeLecture(req.params.userid, req.body.lectureid);
  if (result) {
    res1 = {'result': 'Lecture removed from course listing.'};
    apiResponse.result (res, res1, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}


const getStudentCategories: IController = async (req,res) => {
  const allCategories = await courseService.getStudentCategories();
  if (allCategories) {
    apiResponse.result(res, allCategories, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}





const addCategory: IController = async (req, res) => {
  const newCategory = await courseService.addCategory(
    req.body.userid,
    req.body.name,
    req.body.description,
  );
  if (newCategory) {
    apiResponse.result(res, newCategory, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res,httpStatusCodes.BAD_REQUEST);
  }
};

const addCourse: IController = async (req, res) => {
  const newCourse = new Course();
  await courseService.addCourse(
    req.body.userid,
    req.body.name,
    req.body.description,
    req.body.categoryid,
    req.body.courseImage,
    //req.body.approved,
  );
  if (newCourse) {
    apiResponse.result(res, newCourse, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res,httpStatusCodes.BAD_REQUEST);
  }
};

const addSection: IController = async (req, res) => {
  const newSection = await courseService.addSection(
    req.body.userid,
    req.body.name,
    req.body.description,
    req.body.courseid,
  );
  if (newSection) {
    apiResponse.result(res, newSection, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res,httpStatusCodes.BAD_REQUEST);
  }
};

const addLecture: IController = async (req, res) => {
  const newLecture = await courseService.addLecture(
    req.body.userid,
    req.body.name,
    req.body.description,
    req.body.sectionid,
    req.body.link,
  );
  const newLink = await courseService.encodeLecture(req.body.link, newLecture.link);
  console.log('New link content: ', newLink);
  if (newLecture) {
    apiResponse.result(res, newLecture, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res,httpStatusCodes.BAD_REQUEST);
  }
};

const courseEnroll: IController = async(req, res) => {
  console.log(req.body.userid);
  console.log(req.body.courseid);
  
  const courseEnrolled = await courseService.courseEnroll(
      req.body.userid,
      req.body.courseid,
    );
  if (courseEnrolled) {
    apiResponse.result(res, courseEnrolled, httpStatusCodes.CREATED, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}


const fetchEnrolledCourses: IController = async(req, res) => {
  let result;
  result = await courseService.fetchEnrolledCourses(req.params.userid);
  if (result) {
    apiResponse.result(res, result, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }

}

const getInstructorLectureByCourse: IController = async(req, res) => {
  let result;
  result = await courseService.getInstructorLectureByCourse(req.params.userid, req.params.courseid);
  if (result) {
    apiResponse.result(res, result, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}



const getLectureByCourse: IController = async(req, res) => {
  let result;
  result = await courseService.getLectureByCourse(req.params.userid, req.params.courseid);
  if (result) {
    apiResponse.result(res, result, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}


const addStudentNotes: IController = async(req, res) => {
  let addNote;
  addNote = await courseService.addStudentNotes(req.body.userid, req.body.lectureid,req.body.description);
  if (addNote) {
    apiResponse.result(res, addNote, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }

}


const returnStudentNotes: IController = async (req, res) => {
  let res1; 
  res1 = await courseService.returnStudentNotes(req.params.userid, req.params.lectureid);
  if (res1) {
    apiResponse.result(res, res1, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}


const editStudentNotes: IController = async(req, res) => {
  let result, res1;
  result = await courseService.editStudentNotes(req.params.userid, req.params.lec, req.params.note, req.body);
  if (result) {
    res1 = {'result':'true'};
    apiResponse.result(res, res1, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }

}

const getInstructorCourseByCategories : IController = async(req, res) => {
  let course;
  console.log('abc');
    try {
      console.log('abc');
    course = await courseService.getInstructorCourseByCategories(req.params.userid,req.params.categoryid);
    console.log("course: ", course);
    if (course) {
      apiResponse.result(res, course, httpStatusCodes.OK, null);
    }
    else {
      apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
    }
  } catch (e) {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}

const deleteStudentNotes : IController = async(req,res) => {
 let note;
 try{
      note = await courseService.deleteStudentNotes(req.params.studentnotesid);
      if (note) {
        apiResponse.result(res, note, httpStatusCodes.OK, null);
      }
      else {
        apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
      } 
    }
  catch(e){
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}

const deleteCourses : IController = async(req,res) => {
  let course;
  try{
      course = await courseService.deleteCourses(req.params.courseid);
       if (course) {
         apiResponse.result(res, course, httpStatusCodes.OK, null);
       }
       else {
         apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
       } 
     }
   catch(e){
     apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}

const deleteLecture : IController = async(req,res) => {
  let lecture;
  try{
      lecture = await courseService.deleteLecture(req.params.lectureid);
       if (lecture) {
         apiResponse.result(res, lecture, httpStatusCodes.OK, null);
       }
       else {
         apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
       } 
     }
   catch(e){
     apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}

const deleteSection : IController = async(req,res) => {
  let section;
  try{
    section = await courseService.deleteSection(req.params.sectionid);
       if (section) {
         apiResponse.result(res, section, httpStatusCodes.OK, null);
       }
       else {
         apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
       } 
     }
   catch(e){
     apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}


const studentUnenroll : IController = async(req, res) => {
   let unenrolled;
   try {
     unenrolled = await courseService.studentUnenroll(req.params.userid, 
                    req.params.courseid);
     if (unenrolled) {
       apiResponse.result(res, unenrolled, httpStatusCodes.OK, null);     
     }
     else {
       apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
     }
   }
   catch (e) {
     apiResponse.error(res, httpStatusCodes.BAD_REQUEST)
   }

}


const countStudentsPerCourse: IController = async(req, res) => {
   let studentCount;
   try {
     studentCount = await courseService.countStudentsPerCourse(req.params.userid);
     if (studentCount) {
       apiResponse.result(res, studentCount, httpStatusCodes.OK, null);
     } else {
       apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
     }
   } catch (e) {
     apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
   }
}

export default {
  courseList,
  pendingCourse,
  approveCourse,
  getCourseByInstructor,
  getCategoryByInstructor,
  getSectionByInstructor,
  getLectureByInstructor,
  addCategory,
  addCourse,
  addSection,
  addLecture,
  getCategories,
  courseEnroll,
  fetchEnrolledCourses,
  getLectureByCourse,
  getSectionByCourse,
  getLectureBySection,
  showAllCourses,
  updateCourseInfo,
  updateSectionInfo,
  updateLectureInfo,
  removeLecture,
  removeCourse,
  showMyCourseStatus,
  addStudentNotes,
  editStudentNotes,
  returnStudentNotes,
  getCourseByCategories,
  getInstructorCourseByCategories,
  deleteStudentNotes,
  deleteCourses,
  deleteLecture,
  deleteSection,
  getCategoriesofInstructor,
  changeCourseType,
  getStudentCategories,
  getInstructorLectureByCourse,
  studentUnenroll,
  countStudentsPerCourse,
};
