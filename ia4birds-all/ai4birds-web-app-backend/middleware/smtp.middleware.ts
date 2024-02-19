import nodemailer from "nodemailer";
import globalConfig from "../config/global.config";
import responseMessages from "../utils/messages/global.messages";

const transporter = nodemailer.createTransport({
	service: globalConfig.smtp.host,
	secure: true,
	logger: globalConfig.smtp.logger as boolean,
	debug: true,
	auth: {
		user: globalConfig.smtp.email,
		pass: globalConfig.smtp.password,
	},
});

function sendMail(mailOptions: any) {
	return new Promise((resolve, reject) => {
		try {
			transporter.verify(function (error, success) {
				if (error) {
					reject({
						status: 500,
						message: responseMessages[500].SMTP_VERIFY_ERROR,
					});
				} else {
					transporter.sendMail(mailOptions, function (error, info) {
						if (error) {
							reject({
								status: 500,
								message: responseMessages[500].SMTP_SEND_ERROR,
							});
						} else {
							resolve({
								status: 200,
								message: responseMessages[200].SMTP_EMAIL_SENT,
							});
						}
					});
				}
			});
		} catch (err: any) {
			reject({
				status: 500,
				message: responseMessages[500].SMTP_SEND_ERROR,
			});
		}
	});
}

const smtpFunctions = {
	sendMail: sendMail,
};

export default smtpFunctions;
