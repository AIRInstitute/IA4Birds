import { Router } from "express";
import {
    activateAccount,
    forgotPassword,
    resetPassword,
    findAll,
    findOne,
    updateUser,
    deleteUser,
} from "../../controllers/user.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const userRouter: Router = Router();

userRouter.get("/activateAccount", activateAccount);
userRouter.get("/forgotPassword", forgotPassword);
userRouter.post("/resetPassword", resetPassword);

userRouter.get("/", [verifyToken], findAll);
userRouter.get("/:id", [verifyToken], findOne);
userRouter.put("/:id", [verifyToken], updateUser);
userRouter.delete("/:id", [verifyToken], deleteUser);

export default userRouter;
