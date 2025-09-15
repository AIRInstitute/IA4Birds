import { Request, Response, NextFunction, Express, Router } from 'express'
import * as multerMiddleware from "../../middleware/multer.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import * as dataCyLController from '../../controllers/dataCyL.controller'
import * as mapController from '../../controllers/map.controller'

export default () => {
    const uploadRoutes: Router = Router();

    uploadRoutes.get(
        "/xenocanto",
        authMiddleware.verifyToken,
        dataCyLController.getXenoCantoRecordings
    )
    uploadRoutes.get(
        "/ebird",
        authMiddleware.verifyToken,
        dataCyLController.getEBirdData
    )
    uploadRoutes.get(
        "/dataBird",
        dataCyLController.getDataBird
    )
    uploadRoutes.post(
        "/windmap",
        mapController.getWindMapData
    )
    uploadRoutes.get(
        "/sensitivity",
        authMiddleware.verifyToken,
        dataCyLController.getSensitivityData
    )
    uploadRoutes.get(
        "/exclusionmap/zip",
        mapController.getExclusionMapData
    )
    uploadRoutes.get(
        "/exclusionmap/all",
        mapController.getExclusionMapAll
    )
    uploadRoutes.get(
        "/exclusionmap/stream-exclusion-data",
        mapController.getExclusionMapDataStreaming
    )
    uploadRoutes.post(
        "/exclusionmap/stream-exclusion-data",
        mapController.addFact
    )
    return uploadRoutes;
};