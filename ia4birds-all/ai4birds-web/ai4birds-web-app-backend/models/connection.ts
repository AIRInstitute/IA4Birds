import { Sequelize, Dialect, Op } from "sequelize";

import config from "../config/db.config";

import userModel from "./models/user.models";
import cameraModel from "./models/cameras.models"

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect as Dialect,
        username: config.username,
        password: config.password,
        database: config.database,
    }
);

const User = userModel(sequelize);
const Camera = cameraModel(sequelize);

Camera.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(Camera, {
  foreignKey: "user_id",
  as: "cameras",
});

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

export { User, Camera, testConnection };
