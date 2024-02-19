import { Router } from "express";
import uploadRoutes from "./routes/upload.routes";
import productRoutes from "./routes/product.routes";


export default (): Router =>{
const mainRouter = Router();
mainRouter.use("/data", uploadRoutes());
mainRouter.use("/default", productRoutes());

    return mainRouter;
}
