// routes/camera.routes.ts
import { Request, Response, NextFunction, Express, Router } from "express";
import cameraController from "../../controllers/camera.controller";

export default () => {
   const cameraRouter: Router = Router();

  cameraRouter.get("/", cameraController.getAll);
  cameraRouter.get("/:id", cameraController.getById);
  cameraRouter.post("/", cameraController.create);
  cameraRouter.put("/:id", cameraController.update);
  cameraRouter.delete("/:id", cameraController.remove);

  return cameraRouter;
};