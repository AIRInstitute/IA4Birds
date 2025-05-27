// routes/camera.routes.ts
import { Request, Response, NextFunction, Express, Router } from "express";
import cameraController from "../../controllers/camera.controller";
import authMiddleware from "../../middleware/auth.middleware";

export default () => {
   const cameraRouter: Router = Router();

  cameraRouter.get("/", cameraController.getAll);
  cameraRouter.get("/accessible", authMiddleware.verifyToken, cameraController.getVisibleCameras);
  cameraRouter.get("/private", authMiddleware.verifyToken, cameraController.getUserPrivateCameras);
  cameraRouter.get("/:id", cameraController.getById);
  cameraRouter.post("/",[authMiddleware.verifyToken], cameraController.create);
  cameraRouter.put("/:id",[authMiddleware.verifyToken], cameraController.update);
  cameraRouter.delete("/:id",[authMiddleware.verifyToken], cameraController.remove);

  return cameraRouter;
};