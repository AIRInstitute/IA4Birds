import { Router } from "express";
import userController from "../../controllers/user.controller";
import authMiddleware from "../../middleware/auth.middleware";

export default () => {
    const userRouter: Router = Router();

    userRouter.get("/", [authMiddleware.verifyToken], userController.findAll);
    userRouter.get(
        "/:id",
        [authMiddleware.verifyToken],
        userController.findOne
    );
    userRouter.put(
        "/:id",
        [authMiddleware.verifyToken],
        userController.updateUser
    );
    userRouter.delete(
        "/:id",
        [authMiddleware.verifyToken],
        userController.deleteUser
    );

    userRouter.post(
        "/activateAccount",
        [authMiddleware.verifyToken],
        userController.activateAccount
    );
    userRouter.post("/forgotPassword", userController.forgotPassword);
    userRouter.post("/resetPassword", userController.resetPassword);

    return userRouter;
};
