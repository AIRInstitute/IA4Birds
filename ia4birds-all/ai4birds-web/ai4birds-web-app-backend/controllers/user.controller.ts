import { Request, Response } from "express";

import globalConfig from "../config/global.config";
import responseMessages from "../utils/messages/global.messages";
import smtp from "../utils/smtp/smtp";
import { resetPasswordTemplate } from "../utils/emailTemplates/general";
import utils, { DecodedToken } from "../utils/utils";
import { User } from "../models/connection";

// User fields that won't be returned in the response when using findAll and
// findOne methods.
const PRIVATE_USER_FIELDS = ["password"];

/**
 * Find all users
 * @returns {User[]} An array of all users (without the private fields)
 */
const findAll = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: PRIVATE_USER_FIELDS },
        });
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
 * @param {number} id The id of the user to find
 * @returns {User} The user object (without the private fields)
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
            attributes: { exclude: PRIVATE_USER_FIELDS },
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
 * Activate a user account.
 * @query {string} token The activation token sent to the ai4birds email.
 * @returns {string} A message indicating the result of the activation.
 */
const activateAccount = async (req: Request, res: Response) => {
    // Check query parameters
    if (!req.query || Object.keys(req.query).length === 0)
        return res
            .status(400)
            .send(responseMessages[400].QUERY_CANNOT_BE_EMPTY);
    if (!utils.keysChecker(req.query, ["token"]))
        return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

    const token = req.query.token as string;

    let decoded_token: DecodedToken;
    try {
        decoded_token = await utils.verifyJWTToken(token, "activation");
    } catch (err: any) {
        return res.status(401).send(responseMessages[401].INVALID_TOKEN);
    }

    try {
        const user = await User.findOne({
            where: { id: decoded_token.id },
        });
        if (!user) return res.status(404).send(responseMessages[404].NOT_FOUND);

        await user.update({ active: true });
        return res.status(200).send(responseMessages[200].USER_ACTIVATED);
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .send(responseMessages[500].INTERNAL_SERVER_ERROR);
    }
};

/**
 * Send an email to reset the user's password.
 * @query {string} email The email of the user to reset the password.
 * @returns {string} A message indicating the result of the email sending.
 */
const forgotPassword = async (req: Request, res: Response) => {
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

        const resetPasswordToken = utils.generateJWTToken(user.id, "reset");
        // TODO: Change the URL to the correct frontend path.
        const url = `${globalConfig.frontendURL}/resetPassword?token=${resetPasswordToken}`;
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
 * @query {string} token The token sent to the user's email to reset the password.
 * @body {string} password The new password for the user.
 * @returns {string} A message indicating the result of the password reset.
 */
const resetPassword = async (req: Request, res: Response) => {
    if (!req.query || Object.keys(req.query).length === 0)
        return res
            .status(400)
            .send(responseMessages[400].QUERY_CANNOT_BE_EMPTY);
    if (!utils.keysChecker(req.query, ["token"]))
        return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

    if (!req.body || Object.keys(req.body).length === 0)
        return res
            .status(400)
            .send(responseMessages[400].QUERY_CANNOT_BE_EMPTY);
    if (!utils.keysChecker(req.body, ["password"]))
        return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

    const token = req.query.token as string;
    const password = req.body.password as string;

    let decoded_token: DecodedToken;
    try {
        decoded_token = await utils.verifyJWTToken(token, "reset");
    } catch (err: any) {
        return res.status(401).send(responseMessages[401].INVALID_TOKEN);
    }

    try {
        const user = await User.findOne({ where: { id: decoded_token.id } });
        if (!user) return res.status(404).send(responseMessages[404].NOT_FOUND);

        let hash: string;
        try {
            hash = await utils.bcryptPassword(password);
        } catch (err: any) {
            return res.status(500).send(err.message);
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
 * @param {string} id The id of the user to update.
 * @body {string?} id The id of the user. (this must be the same as the id in the params, if present)
 * @body {string?} name The new name of the user
 * @body {string?} email The new email of the user
 * @body {string?} password The new password of the user
 * @body {string?} organization The new organization of the user
 * @returns {string} A message indicating the result of the update.
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
        const user = await User.findByPk(id);
        if (!user) return res.status(404).send(responseMessages[404].NOT_FOUND);

        // We don't want to update the id (we are using the params' id), or the
        // password (we need to hash it first), or the email (we are checking
        // for duplicates).  We also ignore the fields active, createdAt.
        const updateData: { [key: string]: any } = {};
        for (const key in req.body) {
            if (["name", "organization"].includes(key)) {
                updateData[key] = req.body[key];
            }
        }

        // Update password if it is in the request
        if (req.body.password) {
            try {
                updateData.password = await utils.bcryptPassword(
                    req.body.password,
                );
            } catch (err: any) {
                return res.status(500).send(err.message);
            }
        }
        // Check if the id in the body is the same as the id in the params.
        if (req.body.id && req.body.id !== id) {
            // TODO: Find a better error message.
            return res
                .status(400)
                .send(responseMessages[400].MISSING_PARAMETERS);
        }
        // Check if the email is already in use.
        if (req.body.email) {
            try {
                // Ignore the current user, otherwise setting an email to the
                // already existing email would fail because of a duplicate.
                const emailDupliacte = await User.findOne({
                    where: { email: req.body.email, id: { $ne: id } },
                });
                if (emailDupliacte)
                    return res
                        .status(409)
                        .send(responseMessages[409].EMAIL_IN_USE);

                updateData.email = req.body.email;
            } catch (err: any) {
                console.error(err);
                return res
                    .status(500)
                    .send(responseMessages[500].INTERNAL_SERVER_ERROR);
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
 * Delete a user by id.
 * @param {string} id The id of the user to delete.
 * @returns {string} A message indicating the result of the deletion.
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
