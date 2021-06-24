import joi from 'joi';

export default {
  register: {
    body: {
      email: joi
        .string()
        .email()
        .required(),
      password: joi
        .string()
        .min(6)
        .max(32)
        .required(),
      name: joi.string().required(),
      username: joi.string().allow('').allow(null),
      phone: joi.string().allow('').allow(null),
      usertype: joi.number(),
      
    },
  },
  login: {
    body: {
      email: joi
        .string()
        .email()
        .required(),
      password: joi.string().required(),
    },
  },
  update: {
    body: {},
  },
  approval: {
    body: {
      userid: joi.number().required(),
      approve: joi.number().required(),
    },
  },
  suggest: {
    body: {
      email: joi
        .string()
        .email()
        .required(),
      userid: joi.number(),
      SuggestionDescription: joi.string(),  
    },
  },
};
