import bcrypt from "bcrypt";
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

export default { generateToken, bytesToSize, keysChecker, bcryptPassword };
