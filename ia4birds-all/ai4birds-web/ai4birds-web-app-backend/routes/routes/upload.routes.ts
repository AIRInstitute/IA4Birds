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
    return dataRouter;
};

// export default function (app: Express) {
//     app.use((req: Request, res: Response, next: NextFunction) => {
//       res.header(
//         'Access-Control-Allow-Headers',
//         'x-access-token, Origin, Content-Type, Accept'
//       )
//       next()
//     })

//     app.get(
//         "/cvs",
//         // multerMiddleware.uploadCV.single("file"),
//         uploadController.uploadCV
//     )

    // app.get(
    //     "/xenocanto",
    //     dataCyLController.getXenoCantoRecordings
    // )
    // app.get(
    //     "/ebird",
    //     dataCyLController.getEBirdData
    // )
    // app.get(
    //     "/databird",
    //     dataCyLController.getDataBird
    // )
    // app.get(
    //     "/winddata",
    //     mapController.getWindMapData
    // )
    // app.get(
    //     "/exclusionmap",
    //     mapController.getExclusionMapData
    // )
//   }
  

