import * as express from 'express';

import userAuth from './user/auth.route';

import course from './course/courseDisplay.route';

import general from './general/general.route';


const router = express.Router();

router.use('/user/auth', userAuth);

router.use('/course', course);

router.use('/general', general);


export default router;
