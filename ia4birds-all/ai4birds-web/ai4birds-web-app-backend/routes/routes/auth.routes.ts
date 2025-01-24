import { Request, Response, NextFunction, Express, Router } from "express";
import authController from "../../controllers/auth.controller";

export default () => {
    const authRouter: Router = Router();

    authRouter.post("/signup", authController.signup);
    authRouter.post("/signin", authController.signin);
    authRouter.post("/activate-account", authController.activateaccount);
    authRouter.post("/confirm-activation", authController.confirmAccountActivation);
    authRouter.post("/reject-account", authController.rejectAccountRequest);
    authRouter.get("/", authController.guardFunction);

    return authRouter;
};
