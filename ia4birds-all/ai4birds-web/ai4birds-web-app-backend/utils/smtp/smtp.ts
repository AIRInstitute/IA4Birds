import nodemailer from "nodemailer";
import globalConfig from "../../config/global.config";
import responseMessages from "../messages/global.messages";

import Mail from "nodemailer/lib/mailer";

console.log(globalConfig);
const transporter = nodemailer.createTransport({
    host: globalConfig.smtp.host,
    port: globalConfig.smtp.port,
    secure: globalConfig.smtp.secure,
    logger: globalConfig.smtp.logger as boolean,
    auth: {
        user: globalConfig.smtp.email,
        pass: globalConfig.smtp.password,
    },
});

function testConnection() {
    transporter.verify(function (error, success) {
        if (error) {
            console.log("SMTP Error: ", error);
        } else {
            console.log("SMTP Connection success");
        }
    });
}

function sendMail(
    mailOptions: Mail.Options
): Promise<{ status: number; message: string }> {
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

export default { sendMail, testConnection };
