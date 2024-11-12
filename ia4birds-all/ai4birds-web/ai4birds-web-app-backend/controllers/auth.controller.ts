import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import globalConfig from "../config/global.config";
import responseMessages from "../utils/messages/global.messages";
import smtp from "../utils/smtp/smtp";
import { activateAccountTemplate } from "../utils/emailTemplates/general";
import utils from "../utils/utils";
import { User } from "../models/connection";

/**
 * Signup a new user
 * @body {string} name The name of the user
 * @body {string} email The email of the user
 * @body {string} password The password of the user
 * @body {string} organization The organization of the user
 * @returns {string} A message indicating the result of the signup.
 */
const signup = async (req: Request, res: Response) => {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).send(responseMessages[400].BODY_CANNOT_BE_EMPTY);
    }

    if (!utils.keysChecker(body, ["name", "email", "password", "organization"]))
        return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

    try {
        const existingUser = await User.findOne({
            where: { email: body.email },
        });
        if (existingUser != null) {
            return res.status(409).send(responseMessages[409].EMAIL_IN_USE);
        }
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .send(responseMessages[500].INTERNAL_SERVER_ERROR);
    }

    let hash: string;
    try {
        hash = await utils.bcryptPassword(body.password);
    } catch (err: any) {
        return res.status(500).send(err.message);
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

    const activateAccountToken = utils.generateJWTToken(user.id, "activation");
    const url = `${globalConfig.backendURL}/api/user/activateAccount?token=${activateAccountToken}`;
    const mailOptions = {
        from: globalConfig.smtp.email,
        to: globalConfig.smtp.email, // send email to the ai4birds admin email
        subject: `${globalConfig.projectName} - Activate account`,
        html: activateAccountTemplate(
            url,
            body.name,
            body.organization,
            body.email,
            globalConfig.projectName,
        ),
    };
    try {
        const mailResponse = await smtp.sendMail(mailOptions);
        if (mailResponse.status === 200) {
            return res.status(200).send(responseMessages[200].SMTP_EMAIL_SENT);
        } else {
            console.error(mailResponse);
            return res.status(500).send(responseMessages[500].SMTP_SEND_ERROR);
        }
    } catch (err: any) {
        console.error(err);
        return res.status(500).send(err.message);
    }
};

/**
 * Log into a user account
 * @body {string} email The email of the user
 * @body {string} password The password of the user
 * @returns {number} id The id of the user
 * @returns {string} name The name of the user
 * @returns {string} email The email of the user
 * @returns {string} accessToken The JWT token for the user
 */
const signin = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body || Object.keys(body).length === 0)
        return res.status(400).send(responseMessages[400].BODY_CANNOT_BE_EMPTY);
    if (!utils.keysChecker(body, ["email", "password"]))
        return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

    try {
        const user = await User.findOne({ where: { email: body.email } });
        if (user == null) {
            return res.status(404).send(responseMessages[404].NOT_FOUND);
        }

        // Check password
        const result = await bcrypt.compare(body.password, user.password);
        if (!result) {
            return res.status(401).send(responseMessages[401].INVALID_PWD);
        }

        // Check if user is active
        if (!user.active) {
            return res
                .status(401)
                .send(responseMessages[500].USER_NOT_ACTIVATED);
        }

        const token = utils.generateJWTToken(user.id, "access");

        // Send token to user
        return res.status(200).send({
            id: user.id,
            name: user.name,
            email: user.email,
            accessToken: token,
        });
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .send(responseMessages[500].INTERNAL_SERVER_ERROR);
    }
};

/**
 * Guard function to check if the user is authenticated
 * @header {string} x-access-token The JWT token
 * @returns {object} {auth: boolean} where auth is true if the user is authenticated
 */
const guardFunction = (req: Request, res: Response) => {
    const token = req.headers["x-access-token"] as string;

    if (!token) {
        return res.status(200).send({
            auth: false,
        });
    }

    jwt.verify(token, globalConfig.secretKey, (error, decoded) => {
        if (error || typeof decoded === "string")
            return res.status(200).send({ auth: false });
        if (!decoded.intent || decoded.intent !== "access")
            return res.status(200).send({ auth: false });
        return res.status(200).send({ auth: true });
    });
};

export default { signup, signin, guardFunction };
