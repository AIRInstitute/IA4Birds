import dotenv from "dotenv";
dotenv.config();

const dataBaseConfig = {
	devMode: process.env.NODE_ENV || false,
	host: process.env.DB_HOST || "postgresql",
	port: process.env.DB_PORT || "5432",
	username: process.env.DB_USERNAME || "postgres",
	password: process.env.DB_PASSWORD || "postgres",
	database: process.env.DB_NAME || "postgres",
	dialect: process.env.DB_DIALECT || "postgres",
};

export default dataBaseConfig;
