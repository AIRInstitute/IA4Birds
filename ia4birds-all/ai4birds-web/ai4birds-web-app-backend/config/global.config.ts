import dotenv from "dotenv";
dotenv.config({ path: "/home/node/app/ai4birds-web-app-backend/.env" });

function toBoolean(value: string | undefined): boolean | undefined {
    if (value == undefined) return undefined;

    return value === "true";
}

const globalConfig = {
    projectName: process.env.PROJECT_NAME || "IA4Birds",
    port: process.env.PORT || "3030",
    secretKey: process.env.SECRET_KEY || "secretKey",
    sessionSecret: process.env.SECRET_SESSION || "secretSession",
    saltRounds: Number(process.env.SALT_ROUNDS) || 10,
    access_expiration: process.env.ACCESS_EXPIRATION_TIME || "1h",
    other_expiration: process.env.OTHER_EXPIRATION_TIME || "15m",
    frontendURL: process.env.FRONTEND_URL || "http://212.128.154.81",
    backendURL: process.env.BACKEND_URL || "http://212.128.154.81:5030",
    pythonURL:
        process.env.PYTHON_URL ||
        "http://ia4birds-pre.der.usal.es:5002/ai4birds-ingest-service/v1",
    smtp: {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: toBoolean(process.env.SMTP_SECURE) || false,
        email: process.env.SMTP_EMAIL || "ia4birds@air-institute.com",
        password: process.env.SMTP_PWD || "vtxuefosyeqytobm",
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
    //AÑADIR AL .ENV DE LOS SERVIDORES ****
    mediamtxApi: process.env.MEDIAMTX_API || "http://mediamtx:9997",
    streamBaseURL: process.env.STREAM_BASE_URL || "https://ia4birds-pre.der.usal.es/streams"

};

console.log(globalConfig.whiteList);

export default globalConfig;
