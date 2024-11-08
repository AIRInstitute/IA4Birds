import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import globalConfig from "../config/global.config";
import responseMessages from "./messages/global.messages";

/**
 * Function to generate a random token for a user session
 * @param  {int} length   token length to generate
 */
const generateToken = (length: number) => {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
};

/**
 * Function to parse bytes to MB, GB or TB
 * @param  {int} bytes   token length to generate
 */
const bytesToSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
    return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
};

const keysChecker = (obj: object, keys: string[]) => {
    return keys.every((key) => {
        return (
            Object.keys(obj).indexOf(key) !== -1 &&
            obj[key] !== null &&
            obj[key] !== undefined &&
            obj[key] !== ""
        );
    });
};

/**
 * Encrypts password and returns hash. If error, returns the correct message to show the user.
 * @param  {string} password   password in plain text
 */
async function bcryptPassword(password: string): Promise<string> {
    let hash, salt;
    try {
        salt = await bcrypt.genSalt(globalConfig.saltRounds);
    } catch (error: any) {
        throw new Error(responseMessages[500].BYCRYPT_SALT_ERROR);
    }

    try {
        hash = await bcrypt.hash(password, salt);
    } catch (error: any) {
        throw new Error(responseMessages[500].BYCRYPT_HASH_ERROR);
    }

    return hash;
}

type JWTIntent = "access" | "activation" | "reset";
/**
 *  Generate a JWT Token for a user ID with an intent
 */
function generateJWTToken(id: number, intent: JWTIntent) {
    return jwt.sign({ id, intent }, globalConfig.secretKey, {
        expiresIn:
            intent === "access"
                ? globalConfig.access_expiration
                : globalConfig.other_expiration,
    });
}

export type DecodedToken = { id: number; intent: JWTIntent };
function verifyJWTToken(
    token: string,
    intent?: JWTIntent
): Promise<DecodedToken> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, globalConfig.secretKey, (err, decoded) => {
            // The token is invalid
            if (err || typeof decoded === "string") return reject();

            if (intent != undefined)
                if (!decoded.intent || decoded.intent != intent)
                    // The token doesn't have the correct intent.
                    return reject();

            // The token doesn't have a user id.
            if (!decoded.id) return reject();

            return resolve(decoded as DecodedToken);
        });
    });
}

export default {
    generateToken,
    bytesToSize,
    keysChecker,
    bcryptPassword,
    generateJWTToken,
    verifyJWTToken,
};
