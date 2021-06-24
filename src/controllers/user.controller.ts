import httpStatusCodes from 'http-status-codes';

import userService from '../services/user.service';
import IController from '../types/IController';
import apiResponse from '../utilities/apiResponse';
import { generateCookie } from '../utilities/encryptionUtils';
import constants from '../constants';
import locale from '../constants/locale';

const login: IController = async (req, res) => {
  const user = await userService.loginUser(
    req.body.email,
    req.body.password,
  );
  console.log('userUer', user);
  if (user) {
    const cookie = await generateUserCookie(user.userid);
    user.token = cookie;
    console.log()
    apiResponse.result(res, user, httpStatusCodes.OK, cookie);
  } 
  else {
    apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      locale.INVALID_CREDENTIALS,
    );
  }
};

const register: IController = async (req, res) => {
  let user;
  try {
    user = await userService.createUser(
      req.body.email,
      req.body.password,
      req.body.name,
      req.body.username,
      req.body.phone,
      req.body.usertype
    );
  } catch (e) {
    if (e.code === constants.ErrorCodes.DUPLICATE_ENTRY) {
      apiResponse.error(
        res,
        httpStatusCodes.BAD_REQUEST,
        locale.EMAIL_ALREADY_EXISTS,
      );
      return;
    }
  }
  console.log(user)
  if (user) {
    // const cookie = await generateUserCookie(user.userid);
    apiResponse.result(res, user, httpStatusCodes.CREATED, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
};


const resetLink: IController = async(req, res) => {
  let result;
  let param = await userService.resetLink(req.body.email);
  if (param == 1) {
    result = {message:'Reset Link sent'}
    apiResponse.result(res, result, httpStatusCodes.OK, null);
  }
  else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}


const resetPassword: IController = async(req, res) => {
  let result;
  let param = await userService.resetPassword(
    req.body.pass1,
    req.body.pass2,
    req.params.token);

  if (param === -1) {
    result = {message: 'Token has expired'};
    apiResponse.result(res, result, httpStatusCodes.OK, null);
  }
  else if (param === 1) {
    result = {message: 'Password reset done'};
    apiResponse.result(res, result, httpStatusCodes.OK, null);
  }
  else if (param == 0) {
    result = {message: 'User not found. Token expired'};
    apiResponse.result(res, result, httpStatusCodes.OK, null);
  }
  else if (param == -10) {
    result = {message: 'Both passwords DO NOT MATCH'};
    apiResponse.result(res, result, httpStatusCodes.OK, null);
  }
  else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}



const verifyAccount: IController = async(req, res) => {
  //let param;
  let result;
  console.log('TOKEN',req.params.token);
  console.log('Headers: \n', req.headers);
  // try {
  //   param = await userService.verifyAccount(
  //       req.query.token as string,
  //     );
  // } catch (e) {
  //   apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  // }
  let param = await userService.verifyAccount(
      req.params.token);
  

  if (param === -1) {
    result = {message: 'Token has expired.'};        // TOKEN REFRESH AFTER EXPIRATION NOT HANDLED YET
    apiResponse.result(res, result, httpStatusCodes.OK, null);
  }
  else if (param === 1) {
    result = {message: 'Account verified.'};
    apiResponse.result(res, result, httpStatusCodes.OK, null);
  }
  else if (param === 0) {
    result = {message: 'Account not found. Bad token.'};
    apiResponse.result(res, result, httpStatusCodes.OK, null);
  }
  else if (param === -10) {
    result = {message: 'Account already verified.'};    
    apiResponse.result(res, result, httpStatusCodes.OK, null);
  }
  else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
  // apiResponse.result(res, result, httpStatusCodes.OK, null);
  // if (param === 1) {
  //   const result = {decision: "Account verified"};
  //   apiResponse.result(res, result, httpStatusCodes.OK, null);
  // } else if (param === 0) {
  //   apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  // }
}



const pendingAd: IController = async (req, res) => {
  let user;
  try {
    user = await userService.pendingAdmin();
    if (user) {
      apiResponse.result(res, user, httpStatusCodes.CREATED, null);
    } else {
      apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
    }
  } catch (e) {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
};

const adminList: IController = async (req, res) => {
  let user;
  try {
    user = await userService.viewAdminList();
    if (user) {
      apiResponse.result(res, user, httpStatusCodes.CREATED, null);
    } else {
      apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
    }
  } catch (e) {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
};

const suggestAdmin: IController = async (req, res) => {
  let result, final;

  result = await userService.suggestAdmin(req.body.email,req.body.userid,req.body.SuggestionDescription);
  
  if (result === 1) {
    final = { suggested: "User suggested for admin rights"};
  }
  else if (result === 2) {
    final = { error: "User already pending approval for admin rights"};
  }
  else if (result === -1) {
    final = {error : "User is already an administrator."};
  }
  else if (result === -10) {
    final = {error : "User is not permitted to become an administrator"};
  }
  else {
    final = {error: "No User with the email exists in Database"};
  }
  apiResponse.result(res, final, httpStatusCodes.OK, null);
};




const mySuggestedAdmins: IController = async(req, res) => {
  let result;
  result = await userService.mySuggestedAdmins(req.params.userid);
  if (Object.keys(result).includes('error')) {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
  else {
    apiResponse.result(res, result, httpStatusCodes.OK, null);
  }
}







const approveAdmin: IController = async (req, res) => {
  let result;

  result = await userService.approveAdmin(
    req.body.userid,
    req.body.approve,
  );
  console.log("Api Result :", result);
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

const banAdmin: IController = async (req, res) => {
  let result;
  result = await userService.banAdmin(req.body.userid);
  const final = { decision: result };
  if (result) {
    apiResponse.result(res, final, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
};


const showUserList: IController = async(req, res) => {
  const result = await userService.showUserList(req.params.userid);
  if (result) {
    apiResponse.result(res, result, httpStatusCodes.OK, null);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
}


const self: IController = async (req, res) => {
  const cookie = await generateUserCookie(req.user.userid);
  apiResponse.result(res, req.user, httpStatusCodes.OK, cookie);
};

const generateUserCookie = async (userId: number) => {
  return {
    key: constants.Cookie.COOKIE_USER,
    value: await generateCookie(
      constants.Cookie.KEY_USER_ID,
      userId.toString(),
    ),
  };
};

export default {
  login,
  register,
  self,
  pendingAd,
  adminList,
  suggestAdmin,
  approveAdmin,
  banAdmin,
  verifyAccount,
  mySuggestedAdmins,
  resetLink,
  resetPassword,
  showUserList,
};
