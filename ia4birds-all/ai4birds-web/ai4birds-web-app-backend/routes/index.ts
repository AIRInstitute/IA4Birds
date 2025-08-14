import { Router } from "express";
import uploadRoutes from "./routes/upload.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import cameraRoutes from "./routes/camera.routes";
import dataRouter from "./routes/data.routes"

export default (): Router => {
    const mainRouter = Router();
    mainRouter.use("/data", uploadRoutes());
    mainRouter.use("/auth", authRoutes());
    mainRouter.use("/user", userRoutes());
    mainRouter.use("/camera", cameraRoutes());
    mainRouter.use("/data-camera", dataRouter());

    return mainRouter;
};
