import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import globalConfig from "../config/global.config";
import responseMessages from "../utils/messages/global.messages";
import smtp from "../utils/smtp/smtp";
import { activateAccountTemplate,activateAdminTemplate, completeRegister, rejectAccountTemplate  } from "../utils/emailTemplates/general";
import utils from "../utils/utils";
import { User } from "../models/connection";

const ENTITY_TRANSLATION: Record<string, string> = {
    "public": "Pública",
    "private": "Privada",
    "external": "Externo"
};

const ENTITY_MAPPING: Record<string, string> = {
    "Pública": "public",
    "Privada": "private",
    "Externo": "external"
};


/**
 * Activate account request
 * @body {string} email The email of the user
 * @body {string} description The description of the user
 * @body {string} organization The organization of the user
 * @body {string} ocupation The ocupation of the user
 * @body {string} entity The type of entity (Publica, Privada, Externo)
 * @returns {string} A message indicating the result of the activate account request.
 */
const activateaccount = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
        return res.status(400).send(responseMessages[400].BODY_CANNOT_BE_EMPTY);
    }

    if (!utils.keysChecker(body, ["email", "description", "organization", "ocupation", "entity"])) {
        return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);
    }

    // Traducir entity antes de enviarlo al template
    const entityTranslated = ENTITY_TRANSLATION[body.entity] || body.entity;

    // Generar token de activación
    const activateAccountToken = await utils.generateJWTToken(body.email, "activation");

    res.cookie("activationToken", activateAccountToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    console.log("TOKEN ACTIVATE:", activateAccountToken);

    // Construcción de la URL con los nuevos parámetros
    const url = `${globalConfig.frontendURL}/accept-decline-component?email=${encodeURIComponent(body.email)}&description=${encodeURIComponent(body.description)}&organization=${encodeURIComponent(body.organization)}&ocupation=${encodeURIComponent(body.ocupation)}&entity=${encodeURIComponent(entityTranslated)}`;

    const mailOptions = {
        from: globalConfig.smtp.email,
        to: globalConfig.smtp.email,
        subject: `${globalConfig.projectName} - Activar cuenta`,
        html: activateAdminTemplate(
            url,
            body.email,
            body.description,
            body.organization,
            body.ocupation,
            entityTranslated,
            globalConfig.projectName
        ),
    };

    try {
        const mailResponse = await smtp.sendMail(mailOptions);
        if (mailResponse.status === 200) {
            return res.status(200).send(responseMessages[200].SMTP_EMAIL_SENT);
        } else {
            console.error(mailResponse);
            return res.status(500).send(responseMessages[500].SMTP_SEND_ERROR);
        }
    } catch (err: any) {
        console.error(err);
        return res.status(500).send(err.message);
    }
};

/**
 * Confirm account activation by the administrator
 * @body {string} email The email of the user to activate
 * @body {string} description A description provided by the user during the activation request
 * @body {string} organization The organization of the user
 * @body {string} ocupation The ocupation of the user
 * @body {string} entity The type of entity (Publica, Privada, Externo)
 * @returns {string} A message indicating the result of the account activation and email sending process.
 */
const confirmAccountActivation = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
        return res.status(400).send(responseMessages[400].BODY_CANNOT_BE_EMPTY);
    }

    console.log("Req.body in Confirm Activation:", req.body);

    const { email, description, organization, ocupation, entity } = body;

    if (!email || !description || !organization || !ocupation || !entity) {
        return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);
    }

    console.log("Email in Confirm Activation:", email);
    console.log("Description in Confirm Activation:", description);
    console.log("Organization in Confirm Activation:", organization);
    console.log("Ocupation in Confirm Activation:", ocupation);
    console.log("entity in Confirm Activation:", entity);

    try {
        // Verificar si ya existe un usuario con este email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).send(responseMessages[409].EMAIL_IN_USE);
        }

        // Transformar el valor de entity al formato esperado por la base de datos
        const entityTranslated = ENTITY_MAPPING[entity] || entity;

        // Crear al usuario en la tabla
        const user = await User.create({
            email,
            description,
            organization,
            ocupation,
            entity: entityTranslated,
            active: false,
            name: "Pending",
            password: "temporary-password",
        });

        // Generar un token para completar el registro
        const registrationToken = await utils.generateJWTToken(user.id, "registration");

        res.cookie("registrationToken", registrationToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 día
        });

        console.log("TOKEN REGISTRATION:", registrationToken);

        

        // URL para que el usuario complete el registro con los nuevos parámetros
        const url = `${globalConfig.frontendURL}/register-form-component?email=${encodeURIComponent(email)}&organization=${encodeURIComponent(organization)}&ocupation=${encodeURIComponent(ocupation)}&entity=${encodeURIComponent(entity)}`;

        // Enviar correo al usuario
        const mailOptions = {
            from: globalConfig.smtp.email,
            to: email,
            subject: `${globalConfig.projectName} - Completa tu registro`,
            html: completeRegister(url, globalConfig.projectName, organization, ocupation, entity),
        };

        const mailResponse = await smtp.sendMail(mailOptions);
        if (mailResponse.status === 200) {
            return res.status(200).send(responseMessages[200].SMTP_EMAIL_SENT);
        } else {
            console.error("Failed to send email:", mailResponse);
            return res.status(500).send(responseMessages[500].SMTP_SEND_ERROR);
        }
    } catch (err: any) {
        console.error("Error during account confirmation:", err.message);
        return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
    }
};

/**
 * Reject account request
 * @body {string} email The email of the user whose account request is rejected
 * @returns {string} A message indicating the rejection of the account request.
 */
const rejectAccountRequest = async (req: Request, res: Response) => {
    const { email } = req.body;

    // Validar que el email no esté vacío
    if (!email) {
        return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);
    }

    // Plantilla de correo para notificar rechazo
    const mailOptions = {
        from: globalConfig.smtp.email,
        to: email,
        subject: `${globalConfig.projectName} - Solicitud de cuenta rechazada`,
        html: rejectAccountTemplate(email, globalConfig.projectName, ),
    };

    try {
        const mailResponse = await smtp.sendMail(mailOptions);
        if (mailResponse.status === 200) {
            return res.status(200).send(responseMessages[200].SMTP_EMAIL_SENT);
        } else {
            console.error("Failed to send rejection email:", mailResponse);
            return res.status(500).send(responseMessages[500].SMTP_SEND_ERROR);
        }
    } catch (err: any) {
        console.error("Error sending rejection email:", err.message);
        return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
    }
};


/**
 * Signup a new user
 * @body {string} name The name of the user
 * @body {string} email The email of the user
 * @body {string} password The password of the user
 * @returns {string} A message indicating the result of the signup.
 */
const signup = async (req: Request, res: Response) => {
    const body = req.body;

    // Validar si el cuerpo de la solicitud está vacío
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).send(responseMessages[400].BODY_CANNOT_BE_EMPTY);
    }

    // Validar los parámetros requeridos
    if (!utils.keysChecker(body, ["name", "password"])) {
        return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);
    }

    // const registrationToken = req.cookies.registrationToken;
    // console.log("TOKEN REGISTRATION SIGN UP: ",registrationToken)
    // if (!registrationToken) {
    //     return res.status(400).send(responseMessages[400].MISSING_TOKEN);
    // }

    // let decodedToken;
    // try {
    //     // Validar el token de registro
    //     decodedToken = utils.verifyJWTToken(registrationToken, "registration");
    // } catch (err: any) {
    //     console.error("Invalid token:", err.message);
    //     return res.status(401).send(responseMessages[401].INVALID_TOKEN);
    // }

    try {
        // Verificar si el usuario ya ha completado su registro
        let email = body.email;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send(responseMessages[404].NOT_FOUND);
        }

        if (user.active) {
            return res.status(409).send(responseMessages[409].USER_ALREADY_REGISTERED);
        }

        // Encriptar la contraseña proporcionada
        const hash = await utils.bcryptPassword(body.password);

        // Completar el registro del usuario
        await user.update({
            name: body.name,
            password: hash,
            // organization: body.organization,
            active: true, // Activar la cuenta del usuario
        });

        return res.status(200).send(responseMessages[200].USER_REGISTERED_SUCCESSFULLY);
    } catch (err: any) {
        console.error("Error during signup:", err.message);
        return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
    }
};


/**
 * Log into a user account
 * @body {string} email The email of the user
 * @body {string} password The password of the user
 * @returns {number} id The id of the user
 * @returns {string} name The name of the user
 * @returns {string} email The email of the user
 * @returns {string} accessToken The JWT token for the user
 */
const signin = async (req: Request, res: Response) => {
    const body = req.body;
    console.log("signIn:");
    console.log("Email:", body.email);
    console.log("Password:", body.password);
    if (!body || Object.keys(body).length === 0)
        return res.status(400).send(responseMessages[400].BODY_CANNOT_BE_EMPTY);
    if (!utils.keysChecker(body, ["email", "password"]))
        return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

    try {
        const user = await User.findOne({ where: { email: body.email } });
        if (user == null) {
            return res.status(404).send(responseMessages[404].NOT_FOUND);
        }

        // Check password
        const result = await bcrypt.compare(body.password, user.password);
        if (!result) {
            return res.status(401).send(responseMessages[401].INVALID_PWD);
        }

        // Check if user is active
        if (!user.active) {
            return res
                .status(401)
                .send(responseMessages[500].USER_NOT_ACTIVATED);
        }

        const token = await utils.generateJWTToken(user.id, "access");

        // Send token to user
        return res.status(200).send({
            id: user.id,
            name: user.name,
            email: user.email,
            accessToken: token,
        });
    } catch (err: any) {
        console.error(err);
        return res
            .status(500)
            .send(responseMessages[500].INTERNAL_SERVER_ERROR);
    }
};

/**
 * Guard function to check if the user is authenticated
 * @header {string} x-access-token The JWT token
 * @returns {object} {auth: boolean} where auth is true if the user is authenticated
 */
const guardFunction = (req: Request, res: Response) => {
    const token = req.headers["x-access-token"] as string;

    if (!token) {
        return res.status(200).send({
            auth: false,
        });
    }

    jwt.verify(token, globalConfig.secretKey, (error, decoded) => {
        if (error || typeof decoded === "string")
            return res.status(200).send({ auth: false });
        if (!decoded.intent || decoded.intent !== "access")
            return res.status(200).send({ auth: false });
        return res.status(200).send({ auth: true });
    });
};

export default { signup, signin, guardFunction,activateaccount, confirmAccountActivation, rejectAccountRequest };
