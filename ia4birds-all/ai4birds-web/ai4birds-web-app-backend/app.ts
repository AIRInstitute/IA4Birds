import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";

import routes from "./routes";

import BodyParser from "body-parser";
import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import swaggerdocs from "./documentation/docs.json";

import path from "path";
import config from "./config/global.config";

import authRoutes from "./routes/routes/auth.routes";
import userRoutes from "./routes/routes/user.routes";
import productRoutes from "./routes/routes/product.routes";

import uploadRoutes from "./routes/routes/upload.routes";

const app: Express = express();

/**
 * Configure the express app to add a withe list of origins
 */
app.use(
	cors({
		origin: "*",
		credentials: false,
	})
);

app.use(cookieParser());
app.use(BodyParser.json());

/**
 *  Register the routes for the API documentation and the logic routes
 */
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerdocs));
app.use("/api", routes());

app.use("/", express.static(path.join(__dirname, "/frontend/")));

// authRoutes(app);
// userRoutes(app);
// productRoutes(app);
// uploadRoutes(app);

app.use(function (
	err: { message: any; status: any },
	req: Request,
	res: Response,
	next: NextFunction
) {
	// set locals, only providing error in development
	console.log(err);
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	res.status(err.status || 404).send({ message: "Unknown route" });
});

app.get("/", (req: Request, res: Response) => {
	res.sendFile(path.join(__dirname, "/frontend/"));
});

export default app;
