import { getRepository } from 'typeorm';
import { User } from '../entities/user/user.entity';
import { UserType } from '../entities/user/usertype.entity';
import { UserStatus } from '../entities/user/userstatus.entity';
import { generateHash, verifyHash } from '../utilities/encryptionUtils';
import { sanitizeUser } from '../utilities/apiUtilities';

const jwt = require('jsonwebtoken');

const UserRepository = () => getRepository(User);
const UserTypeRepository = () => getRepository(UserType);
const UserStatusRepository = () => getRepository(UserStatus);

const getUserById = async (userid: number) => {
  try {
    return await sanitizeUser(
      await getRepository(User).findOne({ userid }),
    );
  } catch (e) {
    return null;
  }
};

const getUserByEmail = async (
  email: string,
  getHash: boolean = false,
) => {
  try {
    return await getRepository(User).findOne({ email });
  } catch (e) {
    return null;
  }
};

const createUser = async (
  email: string,
  pass: string,
  name: string = '',
  username: string='',
  phone: string,
  usertype: number,
) => {
  try {
    console.log('usrType:',usertype);
    const newUser = new User();
    const uType = await UserTypeRepository().findOne(usertype);
    const uStatus = await UserStatusRepository().findOne(3);
    console.log("uType",uType);
    //console.log(newUser.userType, "userType");
    //console.log(userType)
    newUser.email = email;
    newUser.password = await generateHash(pass, 10);
    newUser.name = name;
    newUser.username = username;

    newUser.phone = phone;

    newUser.userType = uType;
    newUser.is_pending = false;
    newUser.userStatus = uStatus;


    
    const val = await getUserByEmail(email);

    if (val) {
      throw new Error('This is an error');
    } else {
      await getRepository(User).save(newUser);
      
      const token = jwt.sign(
        {id: newUser.userid, email:newUser.email},process.env.JWT_SECRET, 
        {expiresIn : 1800});          // TOKEN EXPIRATION IN 30 MINUTES
      console.log(" Token \n", token);

      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to : email,
        from : process.env.SENDGRID_REG_MAIL,
        // subject : 'Welcome to Minerva - Verify your Email',
        // text : `Hello! \n Thanks for registering on the website. Please copy and paste the address below to verify \
        //         your account.\n https://layerslayers.netlify.app/activate/${token}`,
        // html : `<strong>Hello!</strong><p>Thanks for registering on the website.</p><p>Please click on the link \
        //         to verify your account. The link is valid for 30 minutes. \n\n\n<a href='https://layerslayers.netlify.app/activate/${token}'>\n \
        //         Verify Your Account</a>`,
        subject : 'Welcome to Minerva - Verify your Email',
        text : `Hello! \n Thanks for registering on the website. Please copy and paste the address below to verify \
                your account.\n https://minervalearning.netlify.app/activate/${token}`,
        html : `<strong>Hello!</strong><p>Thanks for registering on the website.</p><p>Please click on the link \
                to verify your account. The link is valid for 30 minutes. \n\n\n<a href='https://minervalearning.netlify.app/activate/${token}'>\n \
                Verify Your Account</a>`,
      }
      console.log(msg);
      sgMail.send(msg).then(()=> {
        console.log('Confirmation Mail sent')
      }).catch((error:any) => {
        console.error('Error - Email was not sent')
      });
      return await getRepository(User).save(newUser);
    }
  } catch (e) {
    
    return null;
  }
};


const resetLink = async(email: string) => {

  const usr = await getUserByEmail(email, true);

    if (!usr) {
      throw new Error('This is an error');
    } else {
      
      
      const token = jwt.sign(
        {email:usr.email},process.env.JWT_SECRET, 
        {expiresIn : 600});          // TOKEN EXPIRATION IN 30 MINUTES
      console.log(" Token \n", token);

      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to : email,
        from : process.env.SENDGRID_REG_MAIL,
        subject : 'Minerva - Reset Email Link',
        // text : `Dear ${usr.name}! \n You requested for a password reset. Please copy and paste the address below to reset \
        //         your account.\n https://layerslayers.netlify.app/confirm_reset_password/${token}`,
        // html : `<strong>Hello ${usr.name}!</strong><p>You requested for a password reset.</p><p>Please click on the link \
        //         to reset your account password. The link is valid for 10 minutes. Please ignore the mail if this was not requested \
        //         by you <br><br><a href='https://layerslayers.netlify.app/confirm_reset_password/${token}'> \
        //         <b><u>RESET PASSWORD</b></u></a>`,
        text : `Dear ${usr.name}! \n You requested for a password reset. Please copy and paste the address below to reset \
                your account.\n https://minervalearning.netlify.app/confirm_reset_password/${token}`,
        html : `<strong>Hello ${usr.name}!</strong><p>You requested for a password reset.</p><p>Please click on the link \
                to reset your account password. The link is valid for 10 minutes. Please ignore the mail if this was not requested \
                by you <br><br><a href='https://minervalearning.netlify.app/confirm_reset_password/${token}'> \
                <b><u>RESET PASSWORD</b></u></a>`,
      }
      console.log(msg);
      sgMail.send(msg).then(()=> {
        console.log('Reset Mail sent')
      }).catch((error:any) => {
        console.error('Error - Email was not sent')
      });
      return 1;//await getRepository(User).save(newUser);
    }
  return 0;
}


const resetPassword = async(pass1: string, pass2 : string, token:string) => {
  let user, payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
    user = await getUserByEmail(payload.email);
    if ((Date.now()/1000)>payload.exp) {
      return -1;
    }
    else if (!user) {
      return 0;
    }
    else if (pass1 === pass2) {
      user.password = await generateHash(pass1, 10);
      await getRepository(User).save(user);

      const token = jwt.sign(
        {email:user.email},process.env.JWT_SECRET, 
        {expiresIn : 600});          // TOKEN EXPIRATION IN 30 MINUTES
      console.log(" Token \n", token);

      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to : user.email,
        from : process.env.SENDGRID_REG_MAIL,
        subject : 'Minerva - Password Reset Successful',
        text : `Dear ${user.name}! \n Your request for change in password successfully went through.Continue using \
                Minerva with your new password.\n `,
        html : `<strong>Hello ${user.name}!</strong><p>You successfully reset your password.</p><p> Continue using  \
                Minerva with your updated password. <br> <br> Regards,<br>Team Minerva`,
      }
      console.log(msg);
      sgMail.send(msg).then(()=> {
        console.log('Password reset Confirmation Mail sent')
      }).catch((error:any) => {
        console.error('Error - Email was not sent')
      });

      return 1;
    }
    else if (pass1 !== pass2) {
      return -10;
    }

  }
  catch (e) {
    return -2;
  }
}





const verifyAccount = async (token: string) => {
  let user, payload;
  try {
  payload = jwt.verify(token, process.env.JWT_SECRET);
  console.log(payload);
  user = await UserRepository().findOne(payload.id);
  //
  const uStatus = await UserStatusRepository().findOne(1);
  console.log('Date Now: ', Date.now());
  console.log('Load exp: ', payload.exp);

  if ((Date.now()/1000) > payload.exp) {
    return -1;
  }
  else if (!user) {
    return 0;
  }
  else if (user.is_verified === false) {
    user.is_verified = true;
    user.userStatus = uStatus;
    await getRepository(User).save(user);
    return 1;
  }
  else if (user.is_verified === true) {
    return -10;
  }
 }
 catch(e) {
   return -1;
 }

}





const updateUser = async (user: User) => {
  return await getRepository(User).save(user);
};


function getDateTime() {
        var now     = new Date(); 
        var year    = now.getFullYear();
        var month   = now.getMonth()+1; 
        var day     = now.getDate();
        var hour    = now.getHours();
        var minute  = now.getMinutes();
        var second  = now.getSeconds(); 
        let mn, dy,hr, min, sec;
        if(month.toString().length == 1) {
             mn = '0'+month.toString();
        }
        else {
          mn = month.toString();
        }
        if(day.toString().length == 1) {
             dy = '0'+day.toString();
        }
        else {
          dy = day.toString();
        }
        if(hour.toString().length == 1) {
             hr = '0'+hour.toString();
        }
        else {
          hr = hour.toString();
        }
        if(minute.toString().length == 1) {
             min = '0'+minute.toString();
        }
        else {
          min = minute.toString();
        }
        if(second.toString().length == 1) {
             sec = '0'+second.toString();
        }
        else {
          sec = second.toString();
        }   
        var dateTime = year+'/'+mn+'/'+dy+' '+hr+':'+min+':'+sec;
        return dateTime;
    }


const loginUser = async (email: string, password: string) => {
  try {
    const user = await getUserByEmail(email, true);
    console.log('USER: ', user);

    const userObject: any = await UserRepository()
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userType', 'userType')
      .where('user.userid = :id', { id: user.userid })
      .getOne();

    console.log('USER: ', user);
    if (userObject) {

      if (userObject.is_verified === false) {
        return ({ "error" : "User account is not verified. Check your email for a verification email."});
      }
      else if (await verifyHash(password, user.password)) {
        userObject.lastLogin = new Date();
        await getRepository(User).save(userObject);

        return userObject;

      }
    }
  }
  catch (e) {

    return null;
  }

  return null;
};

const pendingAdmin = async () => {
  const userObj: any = await UserRepository()
    .createQueryBuilder('user')
    .where('user.is_pending = :id', { id: 1 })
    .getMany();

  return userObj;
};

const viewAdminList = async () => {
  const userObj: any = await UserRepository()
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.userType', 'usertype')
    .where('user.userType = :id', { id: 2 })
    .getMany();

  return userObj;
};

const suggestAdmin = async (email: string,userid: number,SuggestionDescription : string) => {
  
  try {
  const userObj: any = await UserRepository()
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.userType','usertype')
    .where('user.email = :uemail', { uemail: email })
    .getOne();

  if (userObj) {
    console.log('UserObj.userType: ',userObj.userType);
    if (userObj.userType.usertypeid === 2) {
      return -1;
    }
    else if (userObj.is_pending === true) {
      return 2;
    }
    else if ((userObj.is_pending === false) && (userObj.is_ban === true)) {
       return -10;
    }
    else if ((userObj.is_pending === false) && (userObj.is_ban === false)) {
      userObj.is_pending = true;
      userObj.SuggestionDescription = SuggestionDescription;
      const userObj2 = getUserById(userid);
      userObj.Suggestedby = (await userObj2).name;
      userObj.suggestedBy_id = (await userObj2).userid;
      await getRepository(User).save(userObj);
      return 1;
    }
  }  
  
  else {
    return 0;
  }
  }
  catch (e) {
    console.log('Error',e);
    return 0;
  }
};



///
//    SHOW SUGGESTED USERS FOR ADMIN by OTHER ADMINS, and THEIR STATUS
//    PUT STATUS OPTION IN PENDINGADMIN API TO SHOW HOW MANY REQUESTS ARE PENDING
//    both on ADMIN and SUPERADMIN pages
///

//for admin view
const mySuggestedAdmins = async(userid: string) => {
  var suggestedUsers;
  try {
    const user = await UserRepository()
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.userType', 'usertype')
    .where('user.suggestedBy_id = :id', {id: userid})
    .getMany();
    console.log('suggested users: ');
    user.forEach(function(entry) {
      //console.log(entry);
      if ((entry.is_pending === true) && (entry.is_ban === false) && (entry.userType.usertypeid != 2)) {
        Object.assign(entry, {suggestStatus : "Pending"});
      } else if ((entry.is_pending === false) && (entry.is_ban === false) && (entry.userType.usertypeid == 2)) {
         Object.assign(entry, {suggestStatus : "Approved"});
      } else if ((entry.is_pending === false) && (entry.is_ban === false) && (entry.userType.usertypeid != 2)) {
         Object.assign(entry, {suggestStatus : "Rejected"});
      } else if ((entry.is_pending === false) && (entry.is_ban === true) && (entry.userType.usertypeid != 2)) {
         Object.assign(entry, {suggestStatus : "Removed from AdminRights"});
      }
      console.log(entry);
    });
    return user;
  }
  catch (e) {
    return {'error': 'request error'};
  }
}




const approveAdmin = async (userid: number, approve: number) => {
  let val = -1;
  const user: any = await UserRepository()
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.userType','usertype')
  .where('user.userid = :id', {id : userid})
  .getOne();
  
  const uType = await UserTypeRepository().findOne(2);
  //const uType = await UserTypeRepository().findOne(userType);
  console.log('User in approveADmin: ',user);
  if (approve === 1) {
    user.prevType = user.userType.usertypeid;
    user.userType = uType;
    user.is_pending = false;
    await getRepository(User).save(user);
    val = 1;
    return val;
  } else if (approve === 0) { 

    val = 0;
    user.is_pending = false;
    await getRepository(User).save(user);
    return val;
  }

  return val;
};

const banAdmin = async (userid: number) => {
  let val;
  const user: any = await UserRepository()
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.userType','usertype')
  .where('user.userid = :id', {id : userid})
  .getOne();
  const uType = await UserTypeRepository().findOne(user.prevType);
  console.log(uType);
  if (user.is_ban === false) {
    user.is_ban = true;
    user.userType = uType;
    await getRepository(User).save(user);
    val = 1;
    return val;
  } else {
    return 0;
  }
};


const showUserList = async(userid:string) => {
  const admin = await UserTypeRepository().findOne(2);
  const superAdmin = await UserTypeRepository().findOne(1);
  const currentUser = await UserRepository()
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userType', 'usertype')
      .where('user.userid = :id', {id:userid})
      .getOne();
  console.log('currentUser', currentUser.userType);
  console.log('admin', admin);
  console.log('superadmin', superAdmin);
  if (currentUser.userType.usertypeid === admin.usertypeid || currentUser.userType.usertypeid === superAdmin.usertypeid) {
    const userList: any = await UserRepository()
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.userType', 'usertype')
    .leftJoinAndSelect('user.userStatus', 'userstatus')
    .getMany();

    // Dont let a user/admin see his/her own entry
    // Dont let anyone see the superadmin entry
    for (var i = 0; i < userList.length; i++) {
      if (userList[i].userType.usertypeid === superAdmin.usertypeid) {
        userList.splice(i,1);
        i--;
        if (currentUser.userType.usertypeid === superAdmin.usertypeid) {
          break;
        }
      }
      if (userList[i].userid === currentUser.userid) {
        userList.splice(i,1);
        break;
      }
    }
    console.log('UserList: ', userList);
    return userList;

  }
  else {
    return {};
  }
}



// const approveAdmin = async(userid: number) => {

// }

// const approveAdmin = async (user: User) => {

// }

export default {
  createUser,
  loginUser,
  getUserById,
  pendingAdmin,
  viewAdminList,
  suggestAdmin,
  approveAdmin,
  banAdmin,
  verifyAccount,
  mySuggestedAdmins,
  resetLink,
  resetPassword,
  showUserList,
};
