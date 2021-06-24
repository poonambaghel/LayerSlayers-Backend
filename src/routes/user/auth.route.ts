import express from 'express';

import userController from '../../controllers/user.controller';
import userSchema from '../../constants/schema/user.schema';

const router = express.Router();

const schemaValidator = require('express-joi-validator');

router.post(
  '/register',
  schemaValidator(userSchema.register),
  userController.register,
);
router.post(
  '/login',
  schemaValidator(userSchema.login),
  userController.login,
);


router.get('/me', userController.self);

router.get(
	'/super/pendingAdmin',
	userController.pendingAd);

router.get(
	'/super/adminList',
	userController.adminList);

router.post(
	'/admin/suggest',
	schemaValidator(userSchema.suggest),
	userController.suggestAdmin);

router.post(
	'/admin/super/approve',
	schemaValidator(userSchema.approval),
	userController.approveAdmin);

router.post(
	'/admin/super/ban',
	userController.banAdmin);

router.get(
	`/verify-email/:token`,
	userController.verifyAccount);

router.get(
	`/admin/:userid/mySuggestedAdmins`,
	userController.mySuggestedAdmins);

router.post(
	'/user/reset-password',
	userController.resetLink);

router.post(
	`/user/reset-password/:token`,
	userController.resetPassword);

router.get(
	`/view-users/:userid`,
	userController.showUserList);

export default router;
