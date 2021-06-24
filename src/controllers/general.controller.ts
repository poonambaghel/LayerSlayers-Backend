import httpStatusCodes from 'http-status-codes';

import IController from '../types/IController';
import apiResponse from '../utilities/apiResponse';
import generalService from '../services/general.service';




const contactSupport: IController = async(req, res) => {
	/*
		REQUEST body should have fields Name, Email and Message
	*/
	var mail = await generalService.contactSupport(req.body);
	if (mail.resultBin == true) {
		apiResponse.result(res, mail, httpStatusCodes.OK, null);
	} else {
		apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
	}

}




export default {
	contactSupport,
};