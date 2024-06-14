import { Request, Response, NextFunction, Express, Router } from 'express'
import * as multerMiddleware from "../../middleware/multer.middleware";
import * as dataCyLController from '../../controllers/dataCyL.controller'
import * as mapController from '../../controllers/map.controller'

export default () => {
    const dataRouter: Router = Router();

    dataRouter.get(
        "/xenocanto",
        dataCyLController.getXenoCantoRecordings
    )
    dataRouter.get(
        "/ebird",
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
        dataCyLController.getSensitivityData
    )
    dataRouter.get(
        "/exclusionmap/zip",
        mapController.getExclusionMapData
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