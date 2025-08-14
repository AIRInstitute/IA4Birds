import { Request, Response, NextFunction, Express, Router } from 'express'
import * as coordinateController from "../../controllers/coordinate.controller";
import authMiddleware from "../../middleware/auth.middleware";

export default () => {

    const dataRouter: Router = Router();

    dataRouter.get(
    "/coordinate/segment-data",
    authMiddleware.verifyToken,
    coordinateController.getSegmentData
    )

    dataRouter.get(
    "/coordinate/bird-statistics",
    authMiddleware.verifyToken,
    coordinateController.getBirdStatistics
    )

    dataRouter.get(
    "/coordinate/heatmap-data",
    authMiddleware.verifyToken,
    coordinateController.getHeatmapData
    )

    return dataRouter;
};


