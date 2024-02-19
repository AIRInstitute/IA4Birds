import { Request, Response, NextFunction, Express } from "express";

/*********** EXPORTS **************/
import authMiddleware from "../../middleware/auth.middleware";
import authController from "../../controllers/user.controllers";

export default function (app: Express) {
	app.use(function (req: Request, res: Response, next: NextFunction) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});

	app.get(
		"/api/users/:id",
		[authMiddleware.verifyToken],
		authController.findOne
	);

	app.post("/api/users/activateAccount", authController.activateAccount);

	app.put(
		"/api/users/:id/update",
		[authMiddleware.verifyToken],
		authController.updateUser
	);

	app.post("/api/users/forgotPassword", authController.forgotPassword);

	app.post(
		"/api/users/recoverPassword",
		authController.recoverPassword
	);

	app.get(
		"/api/users/",
		[authMiddleware.verifyToken, authMiddleware.isAdmin],
		authController.findAll
	);

	app.delete(
		"/api/users/:id/delete",
		[authMiddleware.verifyToken, authMiddleware.isAdmin],
		authController.deleteUser
	);
}
