import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare email: string;
    declare password: string;
    declare organization: string;
    declare description: string;
    declare active: CreationOptional<boolean>;
    declare createdAt: CreationOptional<Date>;
}

export default (sequelize: Sequelize) => {
    return User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.fn("now"),
            },
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            organization: DataTypes.STRING,
            description: DataTypes.STRING,
        },
        {
            tableName: "user",
            sequelize,
            charset: "utf8",
            collate: "utf8_unicode_ci",
            timestamps: false,
            freezeTableName: true,
        }
    );
};
