import bcrypt from "bcrypt";
import { Request, Response } from "express";

import globalConfig from "../config/global.config";
import responseMessages from "../utils/messages/global.messages";
import smtp from "../utils/smtp/smtp";
import activateAccountTemplate from "../utils/emailTemplates/activateAccount";
import utils from "../utils/utils";
import { User } from "../models/connection";

const SALT_ROUNDS = globalConfig.saltRounds;

const signup = async (req: Request, res: Response) => {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).send(responseMessages[400].BODY_CANNOT_BE_EMPTY);
    }

    if (!utils.keysChecker(body, ["name", "email", "password", "organization"]))
        return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

    const existingUser = User.findOne({ where: { email: body.email } });
    if (existingUser != null) {
        return res.status(409).send(responseMessages[409].EMAIL_IN_USE);
    }

    let salt: string;
    try {
        salt = await bcrypt.genSalt(SALT_ROUNDS);
    } catch (err: any) {
        console.error(err);
        return res.status(500).send(responseMessages[500].BYCRYPT_SALT_ERROR);
    }

    let hash: string;
    try {
        hash = await bcrypt.hash(body.password, salt);
    } catch (err: any) {
        console.error(err);
        return res.status(500).send(responseMessages[500].BYCRYPT_HASH_ERROR);
    }

    // Save user to database
    let user: InstanceType<typeof User>;
    try {
        user = await User.create({
            name: body.name,
            email: body.email,
            password: hash,
            organization: body.organization,
        });
        console.log(user);
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .send(responseMessages[500].INTERNAL_SERVER_ERROR);
    }

    const url = `${globalConfig.backendURL}/api/users/activateAccount?email=${body.email}`;
    const mailOptions = {
        from: globalConfig.smtp.email,
        to: globalConfig.smtp.email,
        subject: `${globalConfig.projectName} - Activate account`,
        html: activateAccountTemplate(
            url,
            body.name,
            body.organization,
            body.email,
            globalConfig.projectName
        ),
    };
    try {
        const mailResponse = await smtp.sendMail(mailOptions);
        console.log("Mail response", mailResponse);
        if (mailResponse.status === 200) {
            return res.status(200).send(user);
        } else {
            console.error(mailResponse);
            return res.status(500).send(responseMessages[500].SMTP_SEND_ERROR);
        }
    } catch (err: any) {
        console.error(err);
        return res.status(500).send(err.message);
    }
};

const signin = (req: Request, res: Response) => {};

const guardFunction = (req: Request, res: Response) => {};

export default { signup, signin, guardFunction };
