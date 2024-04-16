import { Sequelize } from "sequelize";
import { Model } from "sequelize/types";

export default (sequelize: Sequelize, Sequelize: any): typeof Model => {
	const Role = sequelize.define(
		"roles",
		{
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: Sequelize.STRING,
			},
		},
		{
			timestamps: false,
			freezeTableName: true,
		}
	);

	return Role;
};
