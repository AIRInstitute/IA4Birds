import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/*********** EXPORTS **************/
import db from "../models/connection";
import globalConfig from "../config/global.config";

import smtpFunctions from "../middleware/smtp.middleware";

import responseMessages from "../utils/messages/global.messages";
import utils from "../utils/utils";
import emailTemplate from "../utils/emailTemplates/activateAccount";
import { userInputType, usersType } from "../utils/types/types";

/*********** CONSTANTS **************/
const User: any = db.users;
const Role: any = db.roles;
const Op = db.Op;
const SALT_ROUNDS = globalConfig.saltRounds;

/**
 * Signup board
 * @param  {object} req   request received in handler
 * @param  {object} res   response in handler
 */
const signup = (req: Request, res: Response) => {
	// Check request body
	const body = req.body;

	if (!body || Object.keys(body).length == 0)
		return res.status(400).send(responseMessages[400].BODY_CANNOT_BE_EMPTY);

	if (
		!utils.keysChecker(body, [
			"username",
			"name",
			"surname",
			"email",
			"password",
		])
	)
		return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

	// Sign up
	body.role = body.role ? body.role : '1';

	bcrypt.genSalt(SALT_ROUNDS, function (error, salt) {
		if (error) return res.status(500).send(responseMessages[500].BYCRYPT_SALT_ERROR);

		bcrypt.hash(body.password, salt, function (error, passwordHash) {
			if (error) return res.status(500).send(responseMessages[500].BYCRYPT_HASH_ERROR);

			const userTokens: string[] = [
				utils.generateToken(100),
				utils.generateToken(100),
			];

			const newUser: userInputType = {
				username: body.username,
				name: body.name,
				surname: body.surname,
				email: body.email,
				password: passwordHash,
				role: body.role ? body.role : 1,
				access_token: userTokens[0],
				password_token: userTokens[1],
			};

			User.create(newUser)
				.then((user: usersType) => {
					if (!user) return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);

					const url = `${globalConfig.backendURL}/api/users/activateAccount`; // TODO: change this url to a parametrized one
					const mailOptions = {
						from: globalConfig.smtp.email,
						to: user.email,
						subject: `${globalConfig.projectName} - Activate account`,
						html: emailTemplate(
							url,
							user.access_token || "",
							globalConfig.projectName
						),
					};
					smtpFunctions
						.sendMail(mailOptions)
						.then((response: any) => {
							if (response)
								return res.status(200).send(user);
						})
						.catch((error: any) => {
							console.log(`Error: `, error);
							return res.status(500).send(error.message);
						});
				})
				.catch((error: any) => {
					console.log(`Error: `, error);
					return res
						.status(500)
						.send(responseMessages[500].INTERNAL_SERVER_ERROR);
				});
		});
	});
};

/**
 * Login user into platform
 * @param  {object} req   request received in handler
 * @param  {object} res   response in handler
 */
const signin = (req: Request, res: Response) => {
	// Check request body
	const body = req.body;

	if (!body || Object.keys(body).length == 0)
		return res.status(400).send(responseMessages[400].BODY_CANNOT_BE_EMPTY);
	if (!utils.keysChecker(body, ["username", "password"]))
		return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

	// Sign in
	User.findOne({
		where: {
			[Op.or]: [{ username: body.username }, { email: body.username }],
		},
	})
		.then((user: usersType) => {
			if (!user)
				return res
					.status(404)
					.send(responseMessages[404].NOT_FOUND);

			// Check if user is active
			if (!user.active) {
				return res
					.status(500)
					.send(responseMessages[500].USER_NOT_ACTIVATED);
			}

			// Check password validation
			if (!bcrypt.compareSync(body.password, user.password))
				return res
					.status(401)
					.send(responseMessages[401].INVALID_PWD);

			// Set token expiration time
			const token = jwt.sign({ id: user.id }, globalConfig.secretKey, {
				expiresIn: globalConfig.expiration, // 24 hours
			});

			// Check roles
			Role.findByPk(user.role).then((role: any) => {
				res.status(200).send({
					id: user.id,
					username: user.username,
					name: user.name,
					surname: user.surname,
					email: user.email,
					role: role,
					accessToken: token,
				});
			});
		})
		.catch((error: any) => {
			console.error(`Error: `, error);
			res
				.status(500)
				.send(responseMessages[500].INTERNAL_SERVER_ERROR);
		});
};

const guardFunction = (req: Request, res: Response) => {
	const token = req.headers["x-access-token"] as string;

	if (!token) {
		return res.status(200).send({
			auth: false,
		});
	}

	jwt.verify(token, globalConfig.secretKey, (error, decoded) => {
		if (error) return res.status(200).send({ auth: false });
		return res.status(200).send({ auth: true });
	});
};

export default { signup, signin, guardFunction };
