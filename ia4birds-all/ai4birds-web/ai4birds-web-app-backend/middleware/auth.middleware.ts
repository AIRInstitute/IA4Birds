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
    next: NextFunction,
) => {
    // #swagger.security = [{ "accessTokenAuth": [] }]
    // #swagger.responses[401] = { $ref: "#/components/responses/InvalidAccessToken" }

    const token = req.headers["x-access-token"];
    if (!token)
        return res.status(401).send(responseMessages[401].NO_TOKEN_PROVIDED);
    if (Array.isArray(token))
        return res.status(401).send(responseMessages[401].INVALID_TOKEN);

    try {
        const decoded = await utils.verifyJWTToken(token, "access");

        const user = await User.findByPk(decoded.id);
        // If user is not found, the user must have been deleted since the token was issued,
        // so we say the token is invalid.
        if (!user)
            return res.status(401).send(responseMessages[401].INVALID_TOKEN);

        req.session = { id: user.id };
        next();
    } catch (err: any) {
        return res.status(401).send(responseMessages[401].UNAUTHORIZED);
    }
};

export { verifyToken };
