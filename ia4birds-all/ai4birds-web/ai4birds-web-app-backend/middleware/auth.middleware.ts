import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, response } from "express";

import responseMessages from "../utils/messages/global.messages";
import { User } from "../models/connection";
import globalConfig from "../config/global.config";
import utils from "../utils/utils";

type RequestWithSession = Request & {
    session: {
        id: number;
    };
};

const verifyToken = async (
    req: RequestWithSession,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers["x-access-token"];
    if (!token)
        return res.status(403).send(responseMessages[401].NO_TOKEN_PROVIDED);
    if (Array.isArray(token))
        return res.status(403).send(responseMessages[401].INVALID_TOKEN);

    try {
        const decoded = await utils.verifyJWTToken(token, "access");

        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(404).send(responseMessages[404].NOT_FOUND);

        req.session = { id: user.id };
        next();
    } catch (err: any) {
        return res.status(401).send(responseMessages[401].UNAUTHORIZED);
    }
};

export default { verifyToken };
