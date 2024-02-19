/*********** EXPORTS **************/
import db from "../models/connection";
import jwt from "jsonwebtoken";
import config from "../config/global.config";
import responseMessages from "../utils/messages/global.messages";
import { usersType } from "../utils/types/types";
import { NextFunction, Request, Response } from "express";

/*********** CONSTANTS **************/
const Users = db.users;
const Roles = db.roles;
const Op = db.Op;

const verifyToken = (req: any, res: Response, next: NextFunction) => {
	const token = req.headers["x-access-token"] as string;

	if (!token) return res.status(401).send(responseMessages[401].NO_TOKEN_PROVIDED);

	jwt.verify(token, config.secretKey, (error, decoded) => {
		if (error) return res.status(401).send(responseMessages[401].UNAUTHORIZED);

		// @ts-ignore
		Users.findByPk(decoded.id).then((user: usersType) => {
			if (!user) return res.status(404).send(responseMessages[404].NOT_FOUND);

			req.aux = {
				id: user.id,
				role: user.role,
			};
			return next();
		});
	});
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	// @ts-ignore
	Roles.findByPk(req.aux.role).then((role) => {
		if (role.name === "admin") return next();
		else if (role.name === "user") return res.status(403).send(responseMessages[403].REQUIRE_ADMIN_ROLE);
		else return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
	});
};

const isUser = (req: Request, res: Response, next: NextFunction) => {
	// @ts-ignore
	Roles.findByPk(req.aux.role).then((role) => {
		if (role.name === "user") return next();
		else if (role.name === "admin") return res.status(403).send(responseMessages[403].REQUIRE_USER_ROLE);
		else return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
	});
};

const verifySignUp = (req: Request, res: Response, next: NextFunction) => {
	const body = req.body;
	if (!body) return res.status(400).send(responseMessages[400].BODY_CANNOT_BE_EMPTY);
	if (!body.username || !body.email) return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

	Users.findOne({
		where: {
			[Op.or]: [{ username: body.username }, { email: body.email }],
		},
	})
	.then((data: usersType) => {
		if (data) {
			if (data.email === body.email) return res.status(409).send(responseMessages[409].EMAIL_IN_USE)
			else if (data.username === body.username) return res.status(409).send(responseMessages[409].USERNAME_IN_USE);
			else return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
		}
		else return next();
	});
};

export default {
	verifyToken,
	isAdmin,
	isUser,
	verifySignUp,
};
