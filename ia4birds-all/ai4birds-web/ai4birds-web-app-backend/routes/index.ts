import { Router } from "express";
import uploadRoutes from "./routes/upload.routes";


export default (): Router =>{
const mainRouter = Router();
mainRouter.use("/data", uploadRoutes());

    return mainRouter;
}
