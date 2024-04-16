import { Sequelize, Dialect, Op } from "sequelize";

import config from "../config/db.config";

import rolesModel from "./models/roles.models";
import usersModel from "./models/users.models";
import productsModel from "./models/products.models";

/**
 * Obtain the database configuration from the config file
 */
const dbName = config.database || "test";
const dbUser = config.username || "test";
const dbPass = config.password || "test";
const dbDialect: Dialect = (config.dialect as Dialect) || ("mysql" as Dialect);
const dbHost = config.host || "localhost";
const dbPort = config.port || "5432";

/**
 * Create a new instance of Sequelize
 */
const sequelize: Sequelize = new Sequelize(dbName, dbUser, dbPass, {
	host: dbHost,
	dialect: dbDialect,
	port: parseInt(dbPort),
	logging: false,
	define: {
		timestamps: false,
	},
});

const db: any = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Op = Op;
db.ROLES = ["user", "admin"];

// Add the models to the database ORM
db.roles = rolesModel(sequelize, Sequelize);
db.users = usersModel(sequelize, Sequelize);
db.products = productsModel(sequelize, Sequelize);

db.users.belongsTo(db.roles, { as: "role_user", foreignKey: "role" });
db.roles.hasMany(db.users, { as: "user_role", foreignKey: "role" });

db.products.belongsTo(db.users, { as: "user_product", foreignKey: "user_id", onDelete: "CASCADE" });
db.users.hasMany(db.products, { as: "product_user", foreignKey: "user_id", onDelete: "CASCADE" });

async function testConnection() {
	try {
		//alter = true updates the database if schema has changed
		await sequelize.authenticate().then(() => {
			console.log("Connection has been established successfully.");
			sequelize.sync({ alter: config.devMode as boolean }).then(() => {
				console.log(sequelize.models);
				console.log("Database & tables created!");
			});
		});
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
}


export default db;
