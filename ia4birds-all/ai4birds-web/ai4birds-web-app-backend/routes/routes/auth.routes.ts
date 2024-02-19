import { Request, Response, NextFunction } from "express";

/*********** EXPORTS **************/
import authMiddleware from "../../middleware/auth.middleware";
import authController from "../../controllers/auth.controllers";

export default function (app: any) {
	app.use(function (req: Request, res: Response, next: NextFunction) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});

	app.post(
		"/api/auth/signup",
		[authMiddleware.verifySignUp],
		authController.signup
	);

	app.post("/api/auth/signin", authController.signin);

	app.get("/api/auth", authController.guardFunction);
}
