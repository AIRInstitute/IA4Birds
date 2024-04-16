/*********** EXPORTS **************/
import db from "../models/connection";
import utils from "../utils/utils";
import responseMessages from "../utils/messages/global.messages";
import async from "async";
import bcrypt from "bcrypt";
import globalConfig from "../config/global.config";
import smtpFunctions from "../middleware/smtp.middleware";
import { emailTemplate } from '../utils/emailTemplates/recoverPassword'
import { Request, Response } from "express";

/*********** CONSTANTS **************/
const User = db.users;
const Role = db.roles;
const Op = db.Op;
const SALT_ROUNDS = globalConfig.saltRounds;

/**
 * Find all users
 * @param  {object} req   request received in handler
 * @param  {object} res   response in handler
 */
const findAll = (req: Request, res: Response) => {
	// Find all
	User.findAll()
		.then((data: typeof User) => {
			if (data.length > 0) return res.status(200).send(data);
			else return res.status(204).send(responseMessages[204].NO_CONTENT);
		})
		.catch((error: any) => {
			console.error(`Error: `, error);
			return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
		});
};

/**
 * Find a single user with an id
 * @param  {object} req   request received in handler
 * @param  {object} res   response in handler
 */
const findOne = (req: Request, res: Response) => {
	// Check parameters
	const params = req.params;
	let id: string;

	if (!params) return res.status(400).send(responseMessages[400].PARAMS_CANNOT_BE_EMPTY);
	if (!params.id)	return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);
	else id = params.id;

	// Find one
	User.findOne({ 
		where: { id: id },
		attributes: {	
			exclude: ["password", "password_token", "access_token", "role", "active"],
		},
		include: [
			{ model: Role, as: "role_user" },
		],
	})
	.then((data: any) => {
		if (data) return res.status(200).send(data);
		else return res.status(404).send(responseMessages[404].NOT_FOUND);
	})
	.catch((error: any) => {
		console.error(`Error: `, error);
		return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
	});
};

/**
 * Find a single User with a password token given
 * @param  {object} req   request received in handler
 * @param  {object} res   response in handler
 */
const activateAccount = (req: Request, res: Response) => {
	// Check parameters
	const query = req.query;
	let token: string;

	if (!query)	return res.status(400).send(responseMessages[400].QUERY_CANNOT_BE_EMPTY);
	if (!query.token)	return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);
	else token = query.token.toString();

	// Find one
	User.findOne({ where: { access_token: token } })
	.then((data: any) => {
		if (!data) return res.status(404).send(responseMessages[404].NOT_FOUND);

		data.update({
			active: true,
			access_token: null,
		})
		.then((rows_affedted: number) => {
			if (rows_affedted == 1) return res.redirect(`${globalConfig.frontendURL}/login`);
			else return res.status(409).send(responseMessages[409].CONFLICT_UPDATE);
		})
		.catch((error: any) => {
			console.error(`Error: `, error);
			return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
		});
	})
	.catch((error: any) => {
		console.error(`Error: `, error);
		return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
	});
};

/**
 * Find a single User with a password token given
 * @param  {object} req   request received in handler
 * @param  {object} res   response in handler
 */
export const findByPasswordToken = (req: Request, res: Response) => {
	// Check parameters
	const query = req.query
	let token: string

	if (!query) return res.status(400).send(responseMessages[400].QUERY_CANNOT_BE_EMPTY)
	if (!query.token) return res.status(400).send(responseMessages[400].MISSING_PARAMETERS)
	else token = query.token.toString()

	// Find one
  User.findOne({ where: { password_token: token } })
	.then((data: any) => {
		if (data) return res.status(200).send(data);
		else return res.status(404).send(responseMessages[404].NOT_FOUND);
	})
	.catch((error: any) => {
		console.error(`Error: `, error)
		return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR)
	})
}

/**
 * Find user for resetting password
 * @param  {object} req   request received in handler
 * @param  {object} res   response in handler
 */
const forgotPassword = (req: Request, res: Response) => {
	// Check parameters
	const body = req.body;
	if (!body || Object.keys(body).length == 0)
		return res.status(400).send(responseMessages[400].BODY_CANNOT_BE_EMPTY);
	if (!utils.keysChecker(body, ["username", "email"]))
		return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

	User.findOne({
		where: {
			[Op.and]: [{ username: body.username }, { email: body.email }],
		},
	})
	.then((user: any) => {
		if (!user) return res.status(404).send(responseMessages[404].NOT_FOUND);

		const url = `${globalConfig.frontendURL}/recover-password`;
		const mailOptions = {
			from: process.env.SMTP_EMAIL,
			to: user.email,
			subject: "Activate account",
			html: emailTemplate(
				url,
				user.password_token,
				globalConfig.projectName),
		};

		// Async function to send mail
		async function asyncSendMail() {
			const response = await smtpFunctions.sendMail(mailOptions);
		}
		asyncSendMail();

		return res.status(200).send(responseMessages[200].SMTP_EMAIL_SENT);
	})
	.catch((error: any) => {
		console.error(`Error: `, error)
		return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR)
	});
};

/**
 * Reset password for a user by given password_token
 * @param  {object} req   request received in handler
 * @param  {object} res   response in handler
 */
const recoverPassword = (req: Request, res: Response) => {
	// Check parameters
	const body = req.body;

	if (!body || Object.keys(body).length == 0)
		return res.status(400).send(responseMessages[400].BODY_CANNOT_BE_EMPTY);
	if (!utils.keysChecker(body, ["token", "password"]))
		return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

	// Find one
	User.findOne({ where: { password_token: body.token } })
	.then((user: typeof User) => {
		if (!user) return res.status(404).send(responseMessages[404].NOT_FOUND);

		bcrypt.genSalt(SALT_ROUNDS, function (error, salt) {
			if (error) return res.status(500).send(responseMessages[500].BYCRYPT_SALT_ERROR);

			bcrypt.hash(body.password, salt, function (error, passwordHash) {
				if (error) return res.status(500).send(responseMessages[500].BYCRYPT_HASH_ERROR);

				const userTokens: string[] = [
					utils.generateToken(100),
					utils.generateToken(100),
				];
				
				user.update({
					password_token: userTokens[1],
					password: passwordHash,
				})
				.then((rows_affedted: number) => {
					if (rows_affedted == 1) return res.status(200).send(responseMessages[200].PASSWORD_CHANGED);
					else return res.status(409).send(responseMessages[409].CONFLICT_UPDATE);
				})
				.catch((error: any) => {
					console.error(`Error: `, error);
					return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
				});
			});
		});
	})
	.catch((error: any) => {
		console.error(`Error: `, error);
		res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
	});
};

/**
 * Encrypts password and retrieves hashing
 * @param  {string} password   password in text
 */
function bcryptPassword(password: string) {
	return new Promise((resolve, reject) => {
		try {
			// Generate salt for password
			bcrypt.genSalt(SALT_ROUNDS, function (error, salt) {
				if (error) {
					console.error(`Error: `, error);
					reject({ status: 500, password: "" });
				}

				// Hash new password
				bcrypt.hash(password, salt, function (error, passwordHash) {
					if (!error) {
						resolve({ status: 200, password: passwordHash });
					} else {
						console.error(error);
						reject({ status: 500, password: "" });
					}
				});
			});
		} catch (error: any) {
			console.error("Error: " + error);
			reject({ status: 500, password: "" });
		}
	});
}

/**
 * Updates an user's data by the id in the request
 * @param  {object} req   request received in handler
 * @param  {object} res   response in handler
 */
const updateUser = (req: Request, res: Response) => {
	// Check parameters
	const params = req.params;
	const body = req.body;
	let id: string;

	if (!params || !body || Object.keys(body).length == 0) return res.status(400).send(responseMessages[400].BODY_CANNOT_BE_EMPTY);
	if (!params.id) return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);
	else id = params.id;

	if (!utils.keysChecker(body, ["user"]))
		return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

	// Update
	User.findByPk(id)
		.then((user: typeof User) => {
			if (!user) return res.status(404).send(responseMessages[404].NOT_FOUND);

			const updateUserData = {};

			const keys = Object.keys(req.body.user);
			async.forEachOf(
				keys,
				(key: string, i: number, cb: async.ErrorCallback) => {
					if (
						req.body.user[key] != undefined &&
						key != "password" &&
						req.body.user[key] != user[key]
					) {
						updateUserData[key] = req.body.user[key];
					}
					cb(null);
				},
				async (error: any) => {
					if (error) return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
					if (req.body.user.password != undefined) {
						const hashPassword: any = await bcryptPassword(req.body.user.password);

						// Hash password
						if (hashPassword.status == 200) updateUserData["password"] = hashPassword.password;
						else return res.status(500).send(responseMessages[500].BYCRYPT_HASH_ERROR);
					}
					// Try to update user with new data
					const temp = { 
						id: id, 
						...updateUserData 
					};
					user.update(temp, { where: { id: id } })
					.then((rows_affedted: any) => {
						if (rows_affedted == 1) return res.status(200).send(responseMessages[200].UPDATED_SUCCESSFULLY);
						else return res.status(409).send(responseMessages[409].CONFLICT_UPDATE);
					})
					.catch((error: any) => {
						console.error(`Error: `, error);
						return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
					});
				});
		})
		.catch((error: any) => {
			console.error(`Error: `, error);
			return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
		});
};

/**
 * Delete a user with the specified id in the request
 * @param  {object} req   request received in handler
 * @param  {object} res   response in handler
 */
const deleteUser = (req: Request, res: Response) => {
	// Check parameters
	const params = req.params;
	let id: string;

	if (!params) return res.status(400).send(responseMessages[400].PARAMS_CANNOT_BE_EMPTY);
	if (!params.id) return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);
	else id = params.id;

	// Delete
	User.findByPk(id)
	.then((user: typeof User) => {
		if (!user) return res.status(404).send(responseMessages[404].NOT_FOUND);

		user.destroy()
		.then((rows_affedted: number) => {
			if (rows_affedted == 1) return res.status(200).send(responseMessages[200].DELETED_SUCCESSFULLY);
			else return res.status(403).send(responseMessages[403].FORBIDDEN_DELETE);
		})
		.catch((error: any) => {
			console.log(`Error: `,error);
			return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
		});
	})
	.catch((error: any) => {
		console.log(`Error: `, error);
		return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
	});
};

export default {
	findAll,
	findOne,
	activateAccount,
	findByPasswordToken,
	forgotPassword,
	recoverPassword,
	updateUser,
	deleteUser,
};
