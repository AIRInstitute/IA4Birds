import { Sequelize, Dialect, Op, Options } from "sequelize";

import config from "../config/db.config";

import userModel from "./models/user.models";

let sequelize: Sequelize;
if (process.env.NODE_ENV === "test") {
    sequelize = new Sequelize("sqlite::memory:", { logging: false });
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        {
            host: config.host,
            dialect: config.dialect as Dialect,
            username: config.username,
            password: config.password,
            database: config.database,
        },
    );
}

const User = userModel(sequelize);

async function testConnection() {
    try {
        //alter = true updates the database if schema has changed
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        await sequelize.sync({ alter: config.devMode as boolean });
        console.log(sequelize.models);
        console.log("Database & tables created!");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

export { User, testConnection };
