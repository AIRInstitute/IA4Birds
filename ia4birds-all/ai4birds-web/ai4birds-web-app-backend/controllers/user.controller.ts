import { Request, Response } from "express";
import bcrypt from "bcrypt";

import globalConfig from "../config/global.config";
import responseMessages from "../utils/messages/global.messages";
import smtp from "../utils/smtp/smtp";
import { resetPasswordTemplate } from "../utils/emailTemplates/general";
import utils from "../utils/utils";
import { User } from "../models/connection";

const SALT_ROUNDS = globalConfig.saltRounds;

/**
 * Find all users
 */
const findAll = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        if (users.length > 0) return res.status(200).send(users);
        else return res.status(204).send(responseMessages[204].NO_CONTENT);
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .send(responseMessages[500].INTERNAL_SERVER_ERROR);
    }
};

/**
 * Find a single user by id
 */
const findOne = async (req: Request, res: Response) => {
    // Check parameters

    if (!req.params || Object.keys(req.params).length === 0)
        return res
            .status(400)
            .send(responseMessages[400].PARAMS_CANNOT_BE_EMPTY);
    if (!utils.keysChecker(req.params, ["id"]))
        return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password", "active"] },
        });
        if (user) return res.status(200).send(user);
        else return res.status(404).send(responseMessages[404].NOT_FOUND);
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .send(responseMessages[500].INTERNAL_SERVER_ERROR);
    }
};

/**
 * Activate a user account, by email.
 */
const activateAccount = async (req: Request, res: Response) => {
    // Check query parameters
    if (!req.query || Object.keys(req.query).length === 0)
        return res
            .status(400)
            .send(responseMessages[400].QUERY_CANNOT_BE_EMPTY);
    if (!utils.keysChecker(req.query, ["email"]))
        return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

    const email = req.query.email as string;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).send(responseMessages[404].NOT_FOUND);

        await user.update({ active: true });
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .send(responseMessages[500].INTERNAL_SERVER_ERROR);
    }
};

/**
 * Send an email to reset the user's password.
 */
const forgotPassword = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body || Object.keys(body).length === 0)
        return res.status(400).send(responseMessages[400].BODY_CANNOT_BE_EMPTY);
    if (!utils.keysChecker(body, ["email"]))
        return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

    try {
        const user = await User.findOne({ where: { email: body.email } });
        if (!user) return res.status(404).send(responseMessages[404].NOT_FOUND);

        const url = `${globalConfig.backendURL}/api/users/resetPassword?email=${body.email}`;
        const mailOptions = {
            from: globalConfig.smtp.email,
            to: globalConfig.smtp.email,
            subject: `${globalConfig.projectName} - Reset password`,
            html: resetPasswordTemplate(url, globalConfig.projectName),
        };
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
 * Reset the user's password.
 */
const resetPassword = async (req: Request, res: Response) => {
    if (!req.body || Object.keys(req.body).length === 0)
        return res
            .status(400)
            .send(responseMessages[400].QUERY_CANNOT_BE_EMPTY);
    if (!utils.keysChecker(req.body, ["email", "password"]))
        return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

    const { email, password } = req.body as { email: string; password: string };

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).send(responseMessages[404].NOT_FOUND);

        let salt: string;
        try {
            salt = await bcrypt.genSalt(SALT_ROUNDS);
        } catch (err: any) {
            console.error(err);
            return res
                .status(500)
                .send(responseMessages[500].BYCRYPT_SALT_ERROR);
        }
        let hash: string;
        try {
            hash = await bcrypt.hash(password, salt);
        } catch (err: any) {
            console.error(err);
            return res
                .status(500)
                .send(responseMessages[500].BYCRYPT_HASH_ERROR);
        }

        user.update({ password: hash });

        res.send(responseMessages[200].PASSWORD_CHANGED);
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .send(responseMessages[500].INTERNAL_SERVER_ERROR);
    }
};

/**
 * Update a user's data by id. The body of the request is the user object.
 */
const updateUser = async (req: Request, res: Response) => {
    if (!req.params || Object.keys(req.params).length === 0)
        return res
            .status(400)
            .send(responseMessages[400].PARAMS_CANNOT_BE_EMPTY);
    if (!utils.keysChecker(req.params, ["id"]))
        return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);
    const id = req.params.id as string;

    if (!req.body || Object.keys(req.body).length === 0)
        return res.status(400).send(responseMessages[400].BODY_CANNOT_BE_EMPTY);

    try {
        const user = await User.findByPk(req.body.id);
        if (!user) return res.status(404).send(responseMessages[404].NOT_FOUND);

        // We don't want to update the id (it might be wrong!), or the password (the password is hashed just
        // underneath).
        let updateData = {};
        for (const key in req.body) {
            if (key !== "id" && key !== "password") {
                updateData[key] = req.body[key];
            }
        }
        // Update password if it is in the request
        if (req.body.password) {
            try {
                updateData["password"] = await utils.bcryptPassword(
                    req.body.password
                );
            } catch (err: any) {
                return res.status(500).send(err.message);
            }
        }

        await user.update(updateData, { where: { id } });

        return res.status(200).send(responseMessages[200].UPDATED_SUCCESSFULLY);
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .send(responseMessages[500].INTERNAL_SERVER_ERROR);
    }
};

/**
 * Delete a user by id
 */
const deleteUser = async (req: Request, res: Response) => {
    if (!req.params || Object.keys(req.params).length === 0)
        return res
            .status(400)
            .send(responseMessages[400].PARAMS_CANNOT_BE_EMPTY);
    if (!utils.keysChecker(req.params, ["id"]))
        return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).send(responseMessages[404].NOT_FOUND);

        await user.destroy();

        return res.status(200).send(responseMessages[200].DELETED_SUCCESSFULLY);
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .send(responseMessages[500].INTERNAL_SERVER_ERROR);
    }
};

export default {
    findAll,
    findOne,
    activateAccount,
    forgotPassword,
    resetPassword,
    updateUser,
    deleteUser,
};
