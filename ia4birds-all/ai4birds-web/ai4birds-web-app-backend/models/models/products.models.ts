export default (sequelize: any, Sequelize: any) => {
	const Products = sequelize.define(
		"products",
		{
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			user_id: {
				type: Sequelize.INTEGER,
        allowNull: false,
			},
			name: {
				type: Sequelize.STRING,
			},
			description: {
				type: Sequelize.STRING,
			},
			created_at: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn("now"),
			},
		},
		{
			charset: "utf8",
			collate: "utf8_unicode_ci",
			timestamps: false,
			freezeTableName: true,
		}
	);

	return Products;
};
