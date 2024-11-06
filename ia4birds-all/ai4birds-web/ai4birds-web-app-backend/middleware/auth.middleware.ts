import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, response } from "express";

import responseMessages from "../utils/messages/global.messages";
import { User } from "../models/connection";
import globalConfig from "../config/global.config";

type RequestWithSession = Request & {
    session: {
        id: number;
    };
};

const verifyToken = (
    req: RequestWithSession,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers["x-access-token"];
    if (!token)
        return res.status(403).send(responseMessages[401].NO_TOKEN_PROVIDED);
    if (Array.isArray(token))
        return res.status(403).send(responseMessages[401].INVALID_TOKEN);

    jwt.verify(token, globalConfig.secretKey, (err, decoded) => {
        if (err || typeof decoded === "string")
            return res.status(401).send(responseMessages[401].UNAUTHORIZED);

        User.findByPk(decoded.id).then((user) => {
            if (!user)
                return res.status(404).send(responseMessages[404].NOT_FOUND);

            req.session = {
                id: user.id,
            };

            next();
        });
    });
};

export default { verifyToken };
