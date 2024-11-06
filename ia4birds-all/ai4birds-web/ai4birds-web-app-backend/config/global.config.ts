import dotenv from "dotenv";
dotenv.config();

function toBoolean(value: string | undefined): boolean | undefined {
    if (value == undefined) return undefined;

    return value === "true";
}

const globalConfig = {
    projectName: process.env.PROJECT_NAME || "projectName",
    port: process.env.PORT || "3030",
    secretKey: process.env.SECRET_KEY || "secretKey",
    sessionSecret: process.env.SECRET_SESSION || "secretSession",
    saltRounds: Number(process.env.SALT_ROUNDS) || 10,
    expiration: process.env.EXPIRATION_TIME || "180",
    frontendURL: process.env.FRONTEND_URL || "http://212.128.141.36:5173",
    backendURL: process.env.BACKEND_URL || "http://212.128.141.36:5030",
    pythonURL:
        process.env.PYTHON_URL ||
        "http://ia4birds-platform.air-institute.com:5002/ai4birds-ingest-service/v1",
    smtp: {
        host: process.env.SMTP_HOST || "gmail",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: toBoolean(process.env.SMTP_SECURE) || false,
        email: process.env.SMTP_EMAIL || "email",
        password: process.env.SMTP_PWD || "password",
        logger: toBoolean(process.env.SMTP_LOGGER) || true,
    },
    cypher: {
        algorithm: process.env.ENC_ALGORITHM || "aes-256-abc",
        iv: process.env.IV_VECTOR || "iv",
        key: process.env.CYPHER_KEY || "key",
    },
    ssl: {
        cert: process.env.SSL_CERT || "cert",
        key: process.env.SSL_KEY || "key",
    },
    whiteList: process.env.WHITE_LIST || [],
};

console.log(globalConfig.whiteList);

export default globalConfig;
