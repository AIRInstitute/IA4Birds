export default (sequelize: any, Sequelize: any) => {
	const Users = sequelize.define(
		"users",
		{
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			username: {
				type: Sequelize.STRING,
			},
			name: {
				type: Sequelize.STRING,
			},
			surname: {
				type: Sequelize.STRING,
			},
			email: {
				type: Sequelize.STRING,
			},
			password: {
				type: Sequelize.STRING,
			},
			access_token: {
				type: Sequelize.STRING,
			},
			password_token: {
				type: Sequelize.STRING,
			},
			active: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
			created_at: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn("now"),
			},
			role: {
				type: Sequelize.INTEGER,
			},
		},
		{
			charset: "utf8",
			collate: "utf8_unicode_ci",
			timestamps: false,
			freezeTableName: true,
		}
	);

	return Users;
};
