import dotenv from "dotenv";
dotenv.config();

const dataBaseConfig = {
	devMode: process.env.NODE_ENV || false,
	host: process.env.POSTGRES_HOST  || "localhost",
	port: process.env.POSTGRES_PORT  || "5432",
	username: process.env.POSTGRES_USER  || "postgres",
	password: process.env.POSTGRES_PASSWORD  || "postgres",
	database: process.env.POSTGRES_DB  || "postgres",
	dialect: process.env.DB_DIALECT || "postgres",
};

export default dataBaseConfig;
