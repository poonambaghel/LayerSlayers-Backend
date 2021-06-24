import joi from 'joi';

export default {
  viewCourseList: {
    body: {
      name: joi.string().required(),
      description: joi.string().required(),
      createdAt: joi.defaults,
    },
  },
  
  approveCourse : {
    body : {
      courseid: joi
        .number().required(),
      approve: joi
        .number().required(),
    }
  },


};
