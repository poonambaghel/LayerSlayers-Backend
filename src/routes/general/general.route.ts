import express from "express";
import generalController from '../../controllers/general.controller';

const router = express.Router();


router.post(
	'/support',
	generalController.contactSupport);



export default router;