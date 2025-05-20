import { Request, Response, NextFunction, Express, Router } from 'express'
import * as multerMiddleware from "../../middleware/multer.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import * as dataCyLController from '../../controllers/dataCyL.controller'
import * as mapController from '../../controllers/map.controller'

export default () => {
    const dataRouter: Router = Router();

    dataRouter.get(
        "/xenocanto",
        authMiddleware.verifyToken,
        dataCyLController.getXenoCantoRecordings
    )
    dataRouter.get(
        "/ebird",
        authMiddleware.verifyToken,
        dataCyLController.getEBirdData
    )
    dataRouter.get(
        "/dataBird",
        dataCyLController.getDataBird
    )
    dataRouter.post(
        "/windmap",
        mapController.getWindMapData
    )
    dataRouter.get(
        "/sensitivity",
        authMiddleware.verifyToken,
        dataCyLController.getSensitivityData
    )
    dataRouter.get(
        "/exclusionmap/zip",
        mapController.getExclusionMapData
    )
    dataRouter.get(
        "/exclusionmap/all",
        mapController.getExclusionMapAll
    )
    dataRouter.get(
        "/exclusionmap/stream-exclusion-data",
        mapController.getExclusionMapDataStreaming
    )
    dataRouter.post(
        "/exclusionmap/stream-exclusion-data",
        mapController.addFact
    )
    return dataRouter;
};