import { Router } from "express";
import uploadRoutes from "./routes/upload.routes";
import authRoutes from "./routes/auth.routes";

export default (): Router => {
    const mainRouter = Router();
    mainRouter.use("/data", uploadRoutes());
    mainRouter.use("/auth", authRoutes());

    return mainRouter;
};
