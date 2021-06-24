//	Assumption here is, there is no DB storage of 
//	support emails at this stage, hence, no import
//	of DB  


const contactSupport = async(contactObj: any) => {
	var keyList = Object.keys(contactObj);
	if (keyList.includes('email')) {
		try {
			const sgMail = require('@sendgrid/mail');
      		sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      		const msgToSupport = {
      			to : process.env.SUPPORT_EMAIL,
      			from: process.env.SENDGRID_REG_MAIL,
      			subject: `Minerva Support Query: by ${contactObj.name}`,
      			html: `<strong>Greetings!</strong><br><br>
      					<p> You have been contacted via Minerva Support page. Details of the contact:</p><br><br>
      					<p><b> &emsp; Name: </b> ${contactObj.name}</b></p>
      					<p><b> &emsp; Email: </b> ${contactObj.email}</b></p>
      					<p><b> &emsp; Message: </b> ${contactObj.message}</b></p>
      					<br><br><br><strong>Thanks!</strong>`, 

      		}

      		const msgToSender = {
      			to : contactObj.email,
      			from: process.env.SENDGRID_REG_MAIL,
      			subject: 'Minerva Support : Query Raised',
      			html: `<strong>Greetings ${contactObj.name}!</strong><br><br>
      					<p> Thank you for contacting Minerva. Our representative would review and respond to your query soon.</p><br><br>
      					<p>Query raised by you:</p><br><br>
      					
      					<p><i> &emsp; ${contactObj.message}</i></p>
      					<br><br><br><strong>Thanks and Regards<br>Team Minerva</strong>`,
      		}

      		var conf = sgMail.send(msgToSupport).then(()=> {
        		console.log('Mail to Support sent')
      			}).catch((error:any) => {
        		console.error('Mail to support not sent')
      			});

      		var confSender = sgMail.send(msgToSender).then(()=> {
        		console.log('Mail to Support sent')
      			}).catch((error:any) => {
        		console.error('Mail to support not sent')
      			});

      		console.log('conf: ',conf);
      		console.log('confSender: ', confSender);

      		return {'result' : 'Query successfully raised.', 'resultBin': true};

		} catch (e) {
			return {'resultBin': false};
		}	
	}
	
}






export default {
	contactSupport,
};
