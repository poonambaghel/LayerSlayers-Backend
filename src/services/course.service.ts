import { getRepository } from 'typeorm';
import { Course } from '../entities/user/course.entity';
import { Category } from '../entities/user/category.entity';
import { Lecture } from '../entities/user/lecture.entity';
import { Section } from '../entities/user/section.entity';
import { User } from '../entities/user/user.entity';
import { CourseEnrolled } from '../entities/user/courseenrolled.entity';
import { CourseStatus } from '../entities/user/coursestatus.entity';
import { LectureStatus } from '../entities/user/lecturestatus.entity';
import { UserType } from '../entities/user/usertype.entity';
import { StudentNotes } from '../entities/user/studentnotes.entity';

const fs = require('fs');
const aws = require('aws-sdk');



const UserRepository = () => getRepository(User);
const CourseRepository = () => getRepository(Course);
const CategoryRepository = () => getRepository(Category);
const SectionRepository = () => getRepository(Section);
const LectureRepository = () => getRepository(Lecture);
const enrolledCourseRepository = () => getRepository(CourseEnrolled);
const CourseStatusRepository = () => getRepository(CourseStatus);
const UserTypeRepository = () => getRepository(UserType);


const getCourseById = async (courseid : number) => {
      return CourseRepository().findOne({courseid});
};
const StudentNotesRepository = () => getRepository(StudentNotes);

const approveCourseList = async () => {
      const courseObj: any = await CourseRepository()
        .createQueryBuilder('course')
        .leftJoinAndSelect('course.section','section')
        .leftJoinAndSelect('section.lecture','lecture')
        .leftJoinAndSelect('course.courseStatus','coursestatus')
        .where('coursestatus.statusid = :status', {status:2})
        .getMany();
        
      return courseObj;
};


const changeCourseType = async(courseid: number) => {
	var course = await CourseRepository().findOne(courseid);
	if (course.coursetype === 'free') {
		course.coursetype = 'paid';
	} else if (course.coursetype === 'paid') {
		course.coursetype = 'free';
	}
	await getRepository(Course).save(course);
	return course;
}

const pendingCourse = async () => {
	const courseStat = await CourseStatusRepository().findOne(1);
      const courseObj: any = await CourseRepository()
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.courseStatus','coursestatus')
      .leftJoinAndSelect('course.section', 'section')
      .leftJoinAndSelect('section.lecture', 'lecture')
      .where('coursestatus.statusid = :status', {status: 1})
      .getMany();
  
    return courseObj;
}; 

const approveCourse = async (courseid: number, approve: number, adminComment:string) => {
  let val = -1;
  const course: any = await CourseRepository().findOne(courseid);
  if (approve === 1) {
  	const status = await CourseStatusRepository().findOne(2);
    course.approved = true;
    course.pending = false;
    course.adminComment = adminComment;
    course.courseStatus = status;
    await getRepository(Course).save(course);
    val = 1;
    return val;
  } else if (approve === 0) {
    val = 0;
    const status = await CourseStatusRepository().findOne(3);
    course.pending = false;
    course.courseStatus = status;
    course.adminComment = adminComment;
    await getRepository(Course).save(course);
    return val;
  }
  return val;
};

const getCourseByInstructor = async(userid : string) =>{
      const courseObj: any = await CourseRepository()
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.user', 'user')
      .leftJoinAndSelect('course.section','section')
      .leftJoinAndSelect('section.lecture','lecture')
      .leftJoinAndSelect('course.courseStatus', 'coursestatus')
      .where('user.userid = :id', { id: userid })
      //.andWhere('coursestatus.statusid = :status', {status:2})
      //.andWhere("coursestatus.statusid = :stat1 OR coursestatus.statusid = :stat2", {
    	//stat1: 1,
    	//stat2: 2})
      .getMany();

      var filterCourse = []
      for (var i =0;i<courseObj.length; i++) {
      	 if (courseObj[i].courseStatus.statusid == 1 || courseObj[i].courseStatus.statusid == 2) {
      	 	filterCourse.push(courseObj[i]);
      	 }
      }

      return filterCourse;
}

const getCategoryByInstructor = async(userid : string) =>{
  const categoryObj: any = await CategoryRepository()
  .createQueryBuilder('category')
  .leftJoinAndSelect('category.course','course')
  .leftJoinAndSelect('category.user', 'user')
  .where('user.userid = :id', { id: userid })
  .getMany();
  return categoryObj;
}

const getCategories = async(userid: string) =>{
  const categoryObj: any = await CategoryRepository()
  .createQueryBuilder('category')
  .leftJoinAndSelect('category.course','course')
  .leftJoinAndSelect('course.user','user')
  .leftJoinAndSelect('course.courseStatus','coursestatus')
  .getMany();


  console.log('BEFORE :',categoryObj);
  
  for (var i=0; i < categoryObj.length; i++) {
  	var j = 0;
  	var courseList = categoryObj[i].course;
  	while (j < categoryObj[i].course.length) {

  		if (String(categoryObj[i].course[j].user.userid) == userid) {
  			//console.log('categoryObj', categoryObj[i].course[j].userid, userid);
  			if (categoryObj[i].course[j].courseStatus.statusid === 3 || categoryObj[i].course[j].courseStatus.statusid === 4) {
  				categoryObj[i].course.splice(j,1);
  			} else {
  				j += 1;	
  			}
  			
  			
  		} else {
  			categoryObj[i].course.splice(j,1);
  			//console.log('after removal, ',categoryObj[i].course);
  			//console.log('categoryObjRemove', categoryObj[i].course);
  		}
  	}
  }
  console.log('AFTER:', categoryObj);
  return categoryObj;
}


const getCategoriesofInstructor = async(userid: string) =>{
  const categoryObj: any = await CategoryRepository()
  .createQueryBuilder('category')
  .leftJoinAndSelect('category.course','course')
  .leftJoinAndSelect('course.user', 'user')
  .leftJoinAndSelect('course.courseStatus', 'coursestatus')
  .where('user.userid = :id', { id: userid })
  .andWhere("coursestatus.statusid = :stat1 OR coursestatus.statusid = :stat2", {
  	stat1: 1, stat2: 2})
  .getMany();
  return categoryObj;
}


const getStudentCategories = async() => {
	const categoryObj: any = await CategoryRepository()
	.createQueryBuilder('category')
	.leftJoinAndSelect('category.course','course')
	.getMany();
	return categoryObj;
}



const getInstructorCourseByCategories = async (userid:string, categoryid:string) => {
	
	const instructCourse: any = await CourseRepository()
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.user', 'user')
      //.leftJoinAndSelect('course.courseStatus', 'coursestatus')
      .where('user.userid = :id', { id: userid })
      //.andWhere('coursestatus.statusid = :status', {status:2})
      .getMany();

	const courseObj: any = await CourseRepository()
	.createQueryBuilder('course')
	.leftJoinAndSelect('course.category', 'category')
	.where('categoryid = :id', {id: categoryid})
	.getMany();

	console.log('instruct: ',instructCourse);
	console.log('all courses: ', courseObj);

	var enrolledIds = [];
  for (var i = 0; i < instructCourse.length; i++) {
  	console.log('abc');
  	enrolledIds.push(instructCourse[i].courseid);
  	console.log('def');
  }	
  console.log('enrolledids', enrolledIds);

  for (var i = 0; i < courseObj.length; i++) {
  	console.log('abc');
  	// console.log(typeof(fetch[i].courseid));
  	// console.log(fetch[i].courseid in enrolledIds);
  	if (enrolledIds.includes(courseObj[i].courseid)) {
   		Object.assign(courseObj[i], {"mycourse":1});
  	}
  	else {
  		Object.assign(courseObj[i], {"mycourse":0});
  	}
  }

  	console.log('all courses after flag: ', courseObj);
	return courseObj;

}






const getCourseByCategories = async(categoryid: string) => {
	const courseObj: any = await CourseRepository()
	.createQueryBuilder('course')
	.leftJoinAndSelect('course.category', 'category')
	.where('categoryid = :id', {id: categoryid})
	.getMany();
	return courseObj;
}

const getSectionByInstructor = async(userid : string) =>{
  const sectionObj: any = await SectionRepository()
  .createQueryBuilder('section')
  .leftJoinAndSelect('section.user', 'user')
  .where('user.userid = :id', { id: userid })
  .getMany();
  return sectionObj;
}

const getLectureByInstructor = async(userid : string) => {
  const lectureObj: any = await LectureRepository()
  .createQueryBuilder('lecture')
  .leftJoinAndSelect('lecture.user', 'user')
  .leftJoinAndSelect('lecture.section','section')
  .leftJoinAndSelect('section.course', 'course')
  .leftJoinAndSelect('course.category','category')
  .where('user.userid = :id', { id: userid })
  .getMany();
  return lectureObj;
}

const addCategory = async (userid: number, name : string , description : string) => {
  const adm = await UserTypeRepository().findOne(1);
  const superAdm = await UserTypeRepository().findOne(2);

  const user = await UserRepository()
  	.createQueryBuilder('user')
  	.leftJoinAndSelect('user.userType','usertype')
  	.where('user.userid = :id',{id: userid})
  	.getOne();

  if (user.userType.usertypeid === adm.usertypeid || user.userType.usertypeid == superAdm.usertypeid) {
	  
	  const newCategory = new Category();
	  newCategory.name = name;
	  newCategory.description = description;
	  newCategory.user = user;
	  return await getRepository(Category).save(newCategory);
  }
  else {
  	return {};
  }
}

const addCourse = async (userid : number, name : string , description : string, categoryid : number, courseImage: string) => {
  const newCourse = new Course();
  const user = await getRepository(User).findOne(userid);
  const category = await getRepository(Category).findOne(categoryid);
  const coursestatus = await getRepository(CourseStatus).findOne(1);
  newCourse.name = name;
  newCourse.description = description;
  newCourse.user = user;
  newCourse.category = category;
  newCourse.courseStatus = coursestatus;

  if (courseImage == '' || courseImage == null) {
  	return await getRepository(Course).save(newCourse);
  }

  else {
  const s3 = new aws.S3 ({
		accessKeyId:process.env.AWS_KEYID,
		secretAccessKey:process.env.AWS_SECRETKEY
	});
	
	const fileContent = fs.readFileSync(courseImage);
	

	const parameter = {
		Bucket: process.env.BUCKET_NAME,
		Key: name+courseImage.substring(courseImage.length-4),
		Body: fileContent,
		ACL: 'public-read'
	};
	console.log('Parameters: ', parameter);
	return await new Promise((resolve, reject) => {
		s3.upload(parameter, async function (err: any, data:any) {
		if (err) {
			console.log('Errror: ', err);
			throw err;
			reject(err);
		} else {
			newCourse.courseImage = data.Location;

			console.log(`File uploaded successfully. ${data.Location}  : d`, data);	

 			const nCourse = await getRepository(Course).save(newCourse);

 			resolve(nCourse);

		}
	});
	}) 
	}
  //newCourse.approved = approved;
  //return await getRepository(Course).save(newCourse);
}

const addSection = async (userid : number, name : string , description : string,courseid : string) => {
  const newSection = new Section();
  const user = await getRepository(User).findOne(userid);
  const course = await getRepository(Course).findOne(courseid);
  newSection.name = name;
  newSection.description = description;
  newSection.user = user;
  newSection.course = course;
  return await getRepository(Section).save(newSection);
}

const addLecture = async (userid : number, name : string , description : string,sectionid : string,link : string): Promise<any> => {
  let s3link;
  const newLecture = new Lecture();
  const user = await getRepository(User).findOne(userid);
  const section = await getRepository(Section).findOne(sectionid);
  const lecState = await getRepository(LectureStatus).findOne(1);
  newLecture.name = name;
  newLecture.description = description;
  newLecture.user = user;
  newLecture.section = section;
  newLecture.link = link;

  await getRepository(Lecture).save(newLecture);
  return newLecture;
  
  ///// LOGIC FOR AWS FILE UPLOAD
  /*
  console.log ('process.env.BUCKET_NAME:', process.env.BUCKET_NAME);
  console.log ('process.env.AWS_KEYID:', process.env.AWS_KEYID);
  console.log ('process.env.AWS_SECRET:', process.env.AWS_SECRETKEY);
  
  console.log ('path: ',link);
  
//   aws.config.update({
//     accessKeyId: process.env.AWS_KEYID,
//     secretAccessKey: process.env.AWS_SECRETKEY
// });

  const s3 = new aws.S3 ({
		accessKeyId:process.env.AWS_KEYID,
		secretAccessKey:process.env.AWS_SECRETKEY
	});
	
	const fileContent = fs.readFileSync(link);
	

	const parameter = {
		Bucket: process.env.BUCKET_NAME,
		Key: name+link.substring(link.length-4),
		Body: fileContent,
		ACL: 'public-read'
	};
	console.log('Parameters: ', parameter);
	return await new Promise((resolve, reject) => {
		s3.upload(parameter, async function (err: any, data:any) {
		if (err) {
			console.log('Errror: ', err);
			throw err;
			reject(err);
		} else {
			s3link = data.Location;

			newLecture.link = s3link;
			newLecture.lectureStatus = lecState;

			console.log(`File uploaded successfully. ${data.Location}  : d`, data);	

 			const lecture = await getRepository(Lecture).save(newLecture);

 			resolve(lecture);

		}
	});
	})
	*/
}





/// Encode video lecture for streaming
const encodeLecture = async(link:string, newLecLink: string) => {
	// setting transcoding Parameters
	console.log('S3 URL : ', newLecLink);

	const s3 = new aws.S3 ({
		accessKeyId:process.env.AWS_KEYID,
		secretAccessKey:process.env.AWS_SECRETKEY
	});

	var nameMod = '_enc';
	var res = newLecLink.split('/');
	var inputFileName = res[res.length-1];

	const downloadUrl = s3.getSignedUrl('getObject', {
										Bucket: process.env.BUCKET_NAME,
										Key: inputFileName,
										Expires: 3000
											});
	console.log('Download URL: ', downloadUrl);
	
	var nameMod = '_enc';
	var res = link.split('/');
	var inputFileName = res[res.length-1];


	// finding Mediaconvert endpoint
	
	/*
	const media = new aws.MediaConvert(
		{region: 'us-east-1',
		apiVersion: '2017-08-29',
		accessKeyId:process.env.AWS_KEYID,
		secretAccessKey:process.env.AWS_SECRETKEY
		});
	//aws.config.update({region: 'us-east-1'});

	var setting = {
		MaxResults: 0,
	};

	//var endPointPromise = media.describeEndpoints(params).promise();
	
	var endP = await new Promise((resolve, reject) =>
		media.describeEndpoints(params, async function (err:any, data:any) {
			if (err) {
				console.log('error', err);
				throw(err);
				reject(err);
			}
			else {
				console.log(data.Endpoints);
				resolve(data.Endpoints[0].Url);
			}
		})//.promise()

	);
	// var endP = endPointPromise.then(
	//   	function(data:any) {
	//   		end = data.Endpoints;
	//     	console.log("Your MediaConvert endpoint is ", end[0].Url);//data.Endpoints);
	//     	return end[0].Url;
	//   	},
	//   	function(err:any) {
	//     	console.log("Error in finding endpoint", err);
	//     	return 'empty';
	//   	}
	// );
	*/
	
	var endP = process.env.ENDPOINT_URL;
	var params = {
		  "Queue": process.env.JOB_QUEUE_ARN,//u
		  "UserMetadata": {
		    "Customer": "Amazon"//u
		  },
		  "Role": process.env.IAM_ROLE_ARN,//u
		  "Settings": {
		    "OutputGroups": [
		      {
		        "Name": "File Group",
		        "OutputGroupSettings": {
		          "Type": "FILE_GROUP_SETTINGS",
		          "FileGroupSettings": {
		            "Destination": "s3://"+process.env.DIST_BUCKET_NAME+"/"
		          }
		        },
		        "Outputs": [
		          {
		            "VideoDescription": {
		              "ScalingBehavior": "DEFAULT",
		              "TimecodeInsertion": "DISABLED",
		              "AntiAlias": "ENABLED",
		              "Sharpness": 50,
		              "CodecSettings": {
		                "Codec": "H_264",
		                "H264Settings": {
		                  "InterlaceMode": "PROGRESSIVE",
		                  "NumberReferenceFrames": 3,
		                  "Syntax": "DEFAULT",
		                  "Softness": 0,
		                  "GopClosedCadence": 1,
		                  "GopSize": 90,
		                  "Slices": 1,
		                  "GopBReference": "DISABLED",
		                  "SlowPal": "DISABLED",
		                  "SpatialAdaptiveQuantization": "ENABLED",
		                  "TemporalAdaptiveQuantization": "ENABLED",
		                  "FlickerAdaptiveQuantization": "DISABLED",
		                  "EntropyEncoding": "CABAC",
		                  "Bitrate": 5000000,
		                  "FramerateControl": "SPECIFIED",
		                  "RateControlMode": "CBR",
		                  "CodecProfile": "MAIN",
		                  "Telecine": "NONE",
		                  "MinIInterval": 0,
		                  "AdaptiveQuantization": "HIGH",
		                  "CodecLevel": "AUTO",
		                  "FieldEncoding": "PAFF",
		                  "SceneChangeDetect": "ENABLED",
		                  "QualityTuningLevel": "SINGLE_PASS",
		                  "FramerateConversionAlgorithm": "DUPLICATE_DROP",
		                  "UnregisteredSeiTimecode": "DISABLED",
		                  "GopSizeUnits": "FRAMES",
		                  "ParControl": "SPECIFIED",
		                  "NumberBFramesBetweenReferenceFrames": 2,
		                  "RepeatPps": "DISABLED",
		                  "FramerateNumerator": 30,
		                  "FramerateDenominator": 1,
		                  "ParNumerator": 1,
		                  "ParDenominator": 1
		                }
		              },
		              "AfdSignaling": "NONE",
		              "DropFrameTimecode": "ENABLED",
		              "RespondToAfd": "NONE",
		              "ColorMetadata": "INSERT"
		            },
		            "AudioDescriptions": [
		              {
		                "AudioTypeControl": "FOLLOW_INPUT",
		                "CodecSettings": {
		                  "Codec": "AAC",
		                  "AacSettings": {
		                    "AudioDescriptionBroadcasterMix": "NORMAL",
		                    "RateControlMode": "CBR",
		                    "CodecProfile": "LC",
		                    "CodingMode": "CODING_MODE_2_0",
		                    "RawFormat": "NONE",
		                    "SampleRate": 48000,
		                    "Specification": "MPEG4",
		                    "Bitrate": 64000
		                  }
		                },
		                "LanguageCodeControl": "FOLLOW_INPUT",
		                "AudioSourceName": "Audio Selector 1"
		              }
		            ],
		            "ContainerSettings": {
		              "Container": "MP4",
		              "Mp4Settings": {
		                "CslgAtom": "INCLUDE",
		                "FreeSpaceBox": "EXCLUDE",
		                "MoovPlacement": "PROGRESSIVE_DOWNLOAD"
		              }
		            },
		            "NameModifier": nameMod
		          }
		        ]
		      }
		    ],
		    "AdAvailOffset": 0,
		    "Inputs": [
		      {
		        "AudioSelectors": {
		          "Audio Selector 1": {
		            "Offset": 0,
		            "DefaultSelection": "NOT_DEFAULT",
		            "ProgramSelection": 1,
		            "SelectorType": "TRACK",
		            "Tracks": [
		              1
		            ]
		          }
		        },
		        "VideoSelector": {
		          "ColorSpace": "FOLLOW"
		        },
		        "FilterEnable": "AUTO",
		        "PsiControl": "USE_PSI",
		        "FilterStrength": 0,
		        "DeblockFilter": "DISABLED",
		        "DenoiseFilter": "DISABLED",
		        "TimecodeSource": "EMBEDDED",
		        "FileInput": "s3://"+process.env.BUCKET_NAME+"/"+inputFileName
		      }
		    ],
		    "TimecodeConfig": {
		      "Source": "ZEROBASED"
		    }
		}
	};

	//console.log("a",end[0].Url);
	var videoEncode = new aws.MediaConvert(
	{
		region: 'us-east-1',
		apiVersion: '2017-08-29',
		accessKeyId:process.env.AWS_KEYID,
		secretAccessKey:process.env.AWS_SECRETKEY,
		endpoint : endP
	}) ;

	var templateJobPromise = videoEncode.createJob(params).promise();
	console.log('abc');
	// Handle promise's fulfilled/rejected status
	templateJobPromise.then(
	  function(data:any) {
	    console.log("Success! ", data);
	  },
	  function(err:any) {
	    console.log("Error", err);
  	}
	);

	return {}

}






// Update Course Info - for Instructors only

const updateCourseInfo = async(userid:string, courseid: string, courseObj: object) => {
  console.log('courseobj', courseObj);
  const user = await getRepository(User).findOne(userid)
  try {
  const courseOb: any = await CourseRepository()
  .createQueryBuilder('Course')
  .leftJoinAndSelect('Course.user','user')
  .update()
  .set(courseObj)
  .where('Course.courseid = :id',{id: courseid})		// check if course is in table
  .andWhere('user.userid = :usr', {usr: userid})		// check if user who generated the request
  														// is the same user who created the course
  .execute();

  if (courseOb.raw.changedRows === 0) {
		return false;
	}
  return courseOb;
  }
  catch (e) {
  	return false;
  }
  return false;
}



const updateSectionInfo = async(userid:string, courseid:string, sectionid: string, secObj: object) => {

  const user = await getRepository(User).findOne(userid);
  const course = await getRepository(Course).findOne(courseid);
  try {
  const secOb: any = await SectionRepository()
  .createQueryBuilder('Section')
  .leftJoinAndSelect('Section.course', 'course')
  .leftJoinAndSelect('course.user','user')
  .update()
  .set(secObj)
  .where('Section.sectionid = :id',{id: sectionid})
  .andWhere('course.courseid = :crs',{crs: courseid})
  .andWhere('user.userid = :usr', {usr: userid})
  .execute();

  if (secOb.raw.changedRows === 0) {
		return false;
	}
  return secOb;
  }
  catch (e) {
  	return false;
  }
   

  return false;
}



const updateLectureInfo = async(userid:string, sectionid: string, lectureid: string, lecObj: any) : Promise<any> => {
	
	
	try {
		const lecOb: any = await LectureRepository()
		.createQueryBuilder('Lecture')
		.leftJoinAndSelect('Lecture.section','section')
		.leftJoinAndSelect('section.course','Course')
		.leftJoinAndSelect('Course.user','user')
		.update()
		.set(lecObj)
		.where('Lecture.lectureid = :lid',{lid: lectureid})
		.andWhere('section.sectionid = :sid', {sid: sectionid})
		//.andWhere('Course.courseid = :crs', {crs: courseid})
		.andWhere('user.userid = :usr',{usr: userid})
		.execute();

		if (lecOb.raw.changedRows === 0) {
			return false;
		}
		return true;
	}
	catch (e) {
		return false;
	}
	
	return false;
}



///
//		DELETE COURSE
//		ADMIN FUNCTIONALITY
//		WOULD WE GET USERID AND COURSENUMBER FROM FRONTEND
///

const removeCourse = async (userid: string, courseid: number) => {
	const courseState = await getRepository(CourseStatus).findOne(4);
	const usrtype = await getRepository(UserType).findOne(2);
	var courseOb;
	try {
		const user: any = await UserRepository()
		  .createQueryBuilder('user')
		  .leftJoinAndSelect('user.userType','usertype')
		  .where('user.userid = :id', {id : userid})
		  .getOne();

		console.log('User: ', user);
		console.log('usertype: ', usrtype);
		if (user.userType.usertypeid === 2 || user.userType.usertypeid === 1 || user.userType.usertypeid === 3) {
			console.log('aaaa');
			courseOb = await CourseRepository()
			.createQueryBuilder('Course')
			.update()
			.set({courseStatus: courseState})
			.where('Course.courseid = :cid',{cid: courseid})
			.execute();
			console.log('obj: ', courseOb);
		}

		else if (user.usertype != usrtype) {
			return ({'error':'User trying to perform this operation is not authorized to do so.'});
		}
		
		
		console.log('obj: ',courseOb);		

		if (courseOb.raw.changedRows === 0) {
			console.log('abc');
			return ({'error': 'No row found with matching information.'});
		}
		return courseOb;
	}
	catch (e) {
		if (e instanceof TypeError) {
			return ({'TypeError':'User trying to perform this operation is not authorized to do so.'});
		}
		else {
			return ({'error': 'No row found with matching information.'});
		}
	}
}


const showMyCourseStatus = async(userid:string) => {
	const usrType = await getRepository(UserType).findOne(3); 	
	const user = await getRepository(User)
	.createQueryBuilder('user')
	.leftJoinAndSelect('user.userType','usertype')
	.where('user.userid = :id',{id: userid})
	.getOne();
	if (user.userType.usertypeid === 3) {
		const courseList = await getRepository(Course)
		.createQueryBuilder('Course')
		.leftJoinAndSelect('Course.courseStatus','coursestatus')
    .leftJoinAndSelect('Course.section','section')
    .leftJoinAndSelect('section.lecture','lecture')
		.leftJoinAndSelect('Course.user', 'user')
		.where('user.userid = :id', {id: userid})
		.getMany();
		// console.log(courseList);

		for (var i = 0; i < courseList.length; i++) {
			if (courseList[i].courseStatus.statusid === 4) {
				courseList.splice(i,1);
				i--;
			}
		}
		
		return courseList;
	}
	return {'error': 'Unauthorized access'};
}

const removeLecture = async(userid: string, lectureid: number) => {
	const lecState = await getRepository(LectureStatus).findOne(2);
	try {
		const lecOb: any = await LectureRepository()
		.createQueryBuilder('Lecture')
		.leftJoinAndSelect('Lecture.section','section')
		.leftJoinAndSelect('section.course','Course')
		.leftJoinAndSelect('Course.user','user')
		.update()
		.set({lectureStatus: lecState})
		.where('Lecture.lectureid = :lid',{lid: lectureid})
		//.andWhere('Course.courseid = :crs', {crs: courseid})
		.andWhere('user.userid = :usr',{usr: userid})
		.execute();

		if (lecOb.raw.changedRows === 0) {
			return false;
		}
		return true;
	}
	catch (e) {
		return false;
	}

}


///
//			SHOW COURSE IS FREE/PAID, GIVE OPTION TO SET A COURSE TO FREE
//			OR PAID WHILE APPROVING OR DISPLAYING THE APPROVED COURSES
///
///
//	SHOW ALL COURSES - dont include already enrolled courses
//    in the list
////

const showAllCourses = async(userid: string) => {
  const fetchEnrolled: any = await enrolledCourseRepository()
	.createQueryBuilder('courseenrolled')
	.leftJoinAndSelect('courseenrolled.user','CourseEnrolledUser')
	.leftJoinAndSelect('courseenrolled.course','course')
	.leftJoinAndSelect('course.user', 'CourseUser')
  	.where('CourseEnrolledUser.userid = :id', { id: userid })
  	.getMany();

  console.log('fetchEnrolled', fetchEnrolled);
  const fetch = await CourseRepository().createQueryBuilder('course')
  				.leftJoinAndSelect('course.user','user')
  				.getMany();

  var enrolledIds = [];
  for (var i = 0; i < fetchEnrolled.length; i++) {
  	console.log('course creator: ', fetchEnrolled[i].course.user);
  	enrolledIds.push(fetchEnrolled[i].course.courseid);
  }

  for (var i = 0; i < fetch.length; i++) {
  	// console.log(typeof(fetch[i].courseid));
  	// console.log(fetch[i].courseid in enrolledIds);
  	if (enrolledIds.includes(fetch[i].courseid)) {
   		Object.assign(fetch[i], {"enrolled":1});
  	}
  	else {
  		Object.assign(fetch[i], {"enrolled":0});
  	}
  }
 //  console.log(fetch, 'fecth');

 //  const allcourseids = fetch.map((i: any) => { return i.courseid });

 //  const enrolledids = fetchEnrolled.map((i: any) => { return i.course.courseid } );

 //  const courselist = allcourseids.filter(x => !enrolledids.includes(x))
 //  console.log(allcourseids, 'jsjsj', courselist);

 //  const courses: any = await CourseRepository()
	// .createQueryBuilder('course')
	// .leftJoinAndSelect('course.courseStatus','coursestatus')
 //  	.where('course.courseid IN (:...ids)', { ids: courselist })
 //    .andWhere('coursestatus.statusid = :status', {status:2})
 //  	.getMany();
  return fetch;
  //return courses    
}

const courseEnroll = async(userid: number, courseid: number) => {
	/*
		Improvement : Put a check to see if userid sent 
					  actually belongs to a student

	*/
	const newEnrollment = new CourseEnrolled();
	try {
	const user = await getRepository(User).findOne(userid);
	if (!user) {
		return null;
	}
	newEnrollment.user = user;

	} catch (e) {
		console.log('User not available');
		return null;
	}
	try {
		const course = await getRepository(Course).findOne(courseid);
		newEnrollment.course = course;
	} catch (e) {
		console.log('Course not available');
		return null;
	}
	return await getRepository(CourseEnrolled).save(newEnrollment);
}

const getSectionByCourse = async(courseid: string) => {
  var fetchSection;
  try {
  fetchSection = await CourseRepository()
  .createQueryBuilder('Course')
  .leftJoinAndSelect('Course.section','section')
  .where('Course.courseid = :id', {id: courseid})
  //.andWhere('Course.courseStatus.statusid  = :stat', {stat: 2})
  .getMany();
  console.log(fetchSection);
  if (fetchSection.length === 0) {
  	return {'error':'No lectures found'};
  }
  return fetchSection;
  }
  catch (e) {
  	return {'error': 'No sections found'};
  }
}





const getLectureBySection = async(sectionid: string) => {
  var fetchSection;
  try {
  fetchSection = await SectionRepository()
  .createQueryBuilder('Section')
  .leftJoinAndSelect('Section.lecture','lecture')
  .where('Section.sectionid = :id', {id: sectionid})
  .andWhere('lecture.lectureStatus.statusid = :ls', {ls:1})
  .getMany();
  console.log('Fetch section: ',fetchSection);
  if (fetchSection.length === 0) {
  	return {'error':'No lectures found'};
  }
  return fetchSection;
  }
  catch(e) {
  	return {'error':'No lectures found'};			
  }
}

const getLectureByCourse = async (userid: string, courseid: string) => {

	 const fetchEnrolled: any = await enrolledCourseRepository()
	.createQueryBuilder('courseenrolled')
	.leftJoinAndSelect('courseenrolled.user','user')
	.leftJoinAndSelect('courseenrolled.course','course')
  	.where('user.userid = :id', { id: userid })
  	.getMany();
	
	const fetchLec: any = await CourseRepository()
	.createQueryBuilder('course')
	.leftJoinAndSelect('course.section','section')
	.leftJoinAndSelect('section.lecture','lecture')
	.where('course.courseid = :id', {id: courseid})
  .andWhere('course.courseStatus.statusid  = :stat', {stat: 2})
	.getMany();

	var enrolledIds = [];
  for (var i = 0; i < fetchEnrolled.length; i++) {
  	enrolledIds.push(fetchEnrolled[i].course.courseid);
  }

  for (var i = 0; i < fetchLec.length; i++) {
  	// console.log(typeof(fetch[i].courseid));
  	// console.log(fetch[i].courseid in enrolledIds);
  	if (enrolledIds.includes(fetchLec[i].courseid)) {
   		Object.assign(fetchLec[i], {"enrolled":1});
  	}
  	else {
  		Object.assign(fetchLec[i], {"enrolled":0});
  	}
  }

	/*
		CHECK IF FOR NO LECTURES AVAILABLE IN A COURSE, DO YOU WANT A BAD REQUEST ERROR
		OR RETURN AN EMPTY STRING
  */
  console.log (fetchLec);
  // 3 LINES COMMENTED BELOW IS FOR BAD REQUEST ERROR IF NO LECTURES IN A COURSE
  // if (fetchLec.length == 0) {
  // 	return null;
  // }
  return fetchLec;

}



const getInstructorLectureByCourse = async (userid: string, courseid: string) => {

	//  const fetchEnrolled: any = await enrolledCourseRepository()
	// .createQueryBuilder('courseenrolled')
	// .leftJoinAndSelect('courseenrolled.user','user')
	// .leftJoinAndSelect('courseenrolled.course','course')
 //  	.where('user.userid = :id', { id: userid })
 //  	.getMany();
	// 
	const fetchLec: any = await CourseRepository()
	.createQueryBuilder('course')
	.leftJoinAndSelect('course.section','section')
	.leftJoinAndSelect('section.lecture','lecture')
	.leftJoinAndSelect('course.user','user')
	.where('course.courseid = :id1', {id1: courseid})
	.andWhere('user.userid = :id2', {id2: userid})
  	//.andWhere('course.courseStatus.statusid  = :stat', {stat: 2})
	.getMany();

	// var enrolledIds = [];
 //  for (var i = 0; i < fetchEnrolled.length; i++) {
 //  	enrolledIds.push(fetchEnrolled[i].course.courseid);
 //  }

  // for (var i = 0; i < fetchLec.length; i++) {
  // 	// console.log(typeof(fetch[i].courseid));
  // 	// console.log(fetch[i].courseid in enrolledIds);
  // 	if (enrolledIds.includes(fetchLec[i].courseid)) {
  //  		Object.assign(fetchLec[i], {"enrolled":1});
  // 	}
  // 	else {
  // 		Object.assign(fetchLec[i], {"enrolled":0});
  // 	}
  // }

	/*
		CHECK IF FOR NO LECTURES AVAILABLE IN A COURSE, DO YOU WANT A BAD REQUEST ERROR
		OR RETURN AN EMPTY STRING
  */
  console.log (fetchLec);
  // 3 LINES COMMENTED BELOW IS FOR BAD REQUEST ERROR IF NO LECTURES IN A COURSE
  // if (fetchLec.length == 0) {
  // 	return null;
  // }
  return fetchLec;
}




const fetchEnrolledCourses = async (userid: string) => {
	const fetchEnrolled: any = await enrolledCourseRepository()
	.createQueryBuilder('courseenrolled')
	.leftJoinAndSelect('courseenrolled.user','CourseEnrolledUser')
	.leftJoinAndSelect('courseenrolled.course', 'course')
	.leftJoinAndSelect('course.user', 'CourseUser')
	.leftJoinAndSelect('course.category','category')
  	.leftJoinAndSelect('course.section','section')
	.leftJoinAndSelect('section.lecture','lecture')
  	.where('CourseEnrolledUser.userid = :id', { id: userid })
    .andWhere('course.courseStatus.statusid  = :stat', {stat: 2})
  	.getMany();

  console.log (fetchEnrolled);
  return fetchEnrolled;
}
// add Student Notes
const addStudentNotes = async(userid:number, lectureid: number, description: string) => {
	const lec = await getRepository(Lecture).findOne(lectureid);
	const usr = await getRepository(User).findOne(userid);
	try {
		const note = new StudentNotes();
		note.lecture = lec;
		note.user = usr;
		note.description = description;
		return (await getRepository(StudentNotes).save(note));
	} catch (e) {
		return {'error': 'Could not add the note. Try again later'};
	}
}

const deleteStudentNotes = async(studentnotesid : string): Promise<any | null> => {
    const note = await getRepository(StudentNotes).findOne(studentnotesid);
	if(!note){
		const err : any = new Error();
		err.status = 404;
		err.messsage = `This note does not exists`;
	}

	await StudentNotesRepository()
	 .createQueryBuilder()
	 .delete()
	 .from(StudentNotes)
	 .where('StudentNotes.studentnotesid = :id', {id: studentnotesid})
	 .execute();

	return Promise.resolve({message : 'Student Note is now deleted'});
}

const deleteCourses = async(courseid : string):Promise<any | null> => {
	const course = await getRepository(Course).findOne(courseid);
	if(!course){
		const err : any = new Error();
		err.status = 404;
		err.messsage = `This course does not exists`;
	}

	await CourseRepository()
	 .createQueryBuilder()
	 .delete()
	 .from(Course)
	 .where('Course.courseid = :id', {id: courseid})
	 .execute();

	return Promise.resolve({message : 'Course is now deleted'});
}

const deleteSection = async(sectionid : string):Promise<any | null> => {
	const section = await getRepository(Section).findOne(sectionid);
	if(!section){

		const err : any = new Error();
		err.status = 404;
		err.messsage = `This section does not exists`;
	}

	await SectionRepository()
	 .createQueryBuilder()
	 .delete()
	 .from(Section)
	 .where('Section.sectionid = :id', {id: sectionid})
	 .execute();

	return Promise.resolve({message : 'Section is now deleted'});
}

const deleteLecture = async(lectureid : string):Promise<any | null> => {
	const lecture = await getRepository(Lecture).findOne(lectureid);
	if(!lecture){
		const err : any = new Error();
		err.status = 404;
		err.messsage = `This lecture does not exists`;
	}

	await LectureRepository()
	 .createQueryBuilder()
	 .delete()
	 .from(Lecture)
	 .where('Lecture.lectureid = :id', {id: lectureid})
	 .execute();

	return Promise.resolve({message : 'Lecture is now deleted'});
}


//Below API for Student unenroll
const studentUnenroll = async(userid: string, courseid:string): Promise <any|null> => {
	const enrolled = await getRepository(CourseEnrolled)
		.createQueryBuilder('courseenrolled')
		.leftJoinAndSelect('courseenrolled.user','user')
		.leftJoinAndSelect('courseenrolled.course','course')
		.where('courseenrolled.user.userid = :uid',{uid: userid})
		.andWhere('courseenrolled.course.courseid = :cid', {cid: courseid})
		.getOne();
	if (!enrolled) {
		const err :any = new Error();
		err.status = 404;
		err.message = 'This student is not enrolled in this course';
	}	
	//console.log(enrolled);
	var enrollId = enrolled.courseenrolledid;
	console.log(enrollId);
	await getRepository(CourseEnrolled)
	.createQueryBuilder()
	//.leftJoinAndSelect('courseenrolled.user','user')
	//.leftJoinAndSelect('courseenrolled.course','course')
	.delete()
	.from(CourseEnrolled)
	.where ('CourseEnrolled.courseenrolledid = :ceid',{ceid:enrollId})
	.execute();

	return Promise.resolve({message: 'Student has unenrolled from the course'});

}	






// read Student notes of a lecture
const returnStudentNotes = async(userid: string, lectureid:string) => {
	try {
	const notes = await getRepository(StudentNotes)
	.createQueryBuilder('studentnotes')
	.leftJoinAndSelect('studentnotes.user', 'user')
	.leftJoinAndSelect('studentnotes.lecture','lecture')
	.where('studentnotes.user.userid = :uid', {uid: userid})
	.where('studentnotes.lecture.lectureid = :lid', {lid: lectureid})
	.getMany();
	notes.reverse();
	return notes;
	}
	catch (e) {
		return {};
	}
}

//edit Student Notes
const editStudentNotes = async(userid: string, lectureid: string, notesid: string, editObj: object) => {
	const usr = await getRepository(User).findOne(userid);
	//const lec = await getRepository(Lecture).findOne(lectureid);
	const notes = await getRepository(StudentNotes).findOne(notesid);
	console.log(usr);
	//console.log(lec);
	console.log(notes);
	try {
	const note = await getRepository(StudentNotes)
		.createQueryBuilder('StudentNotes')
		.leftJoinAndSelect('StudentNotes.user','user')
		.leftJoinAndSelect('StudentNotes.lecture','lecture')
		.update()
		.set(editObj)
		.where('lecture.lectureid = :lc', {lc: lectureid})
		.andWhere('user.userid = :us', {us: userid})
		.andWhere('StudentNotes.studentnotesid = :id', {id: notesid})
		// .where('studentnotes.lecture.lectureid = :lid', {lid: lectureid})
		// .andWhere('studentnotes.user.userid = :uid', {uid: userid})
		// .andWhere('studentnotes.studentnotesid = :nid', {nid: notesid})
		.execute();
	if (note.raw.changedRows === 0) {
		return false;
	} else {
		return true;
	}
	} catch (e) {
		return false;
	}
	return false;
}


const countStudentsPerCourse = async(userid:string) => {
	const courseList = await enrolledCourseRepository()
		.createQueryBuilder('courseenrolled')
		.leftJoinAndSelect('courseenrolled.course','course')
		.leftJoinAndSelect('courseenrolled.user','USer')
		.leftJoinAndSelect('course.user','user')
		.where('user.userid = :uid',{uid:userid})
		.getMany();

	//	console.log(courseList);
	var countMsg = {"message" : courseList.length};
	console.log(countMsg);
	return countMsg;
}



export default {
      getCourseById,
      approveCourseList,
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
      showAllCourses,
      getSectionByCourse,
      getLectureBySection,
      updateCourseInfo,
      updateSectionInfo,
      updateLectureInfo,
      removeLecture,
      removeCourse,
      showMyCourseStatus,
      addStudentNotes,
      returnStudentNotes,
      editStudentNotes,
      getCourseByCategories,
      encodeLecture,
      getInstructorCourseByCategories,
  	  deleteStudentNotes,
  	  deleteCourses,
  	  deleteSection,
  	  deleteLecture,
  	  getCategoriesofInstructor,
  	  changeCourseType,
  	  getStudentCategories,
  	  getInstructorLectureByCourse,
  	  studentUnenroll,
  	  countStudentsPerCourse,
};   