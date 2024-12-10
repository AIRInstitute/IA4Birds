import { Request, Response, NextFunction, Express, Router } from "express";
import {
    signup,
    signin,
    guardFunction,
} from "../../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.get("/", guardFunction);

export default authRouter;
