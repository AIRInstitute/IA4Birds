// cameras.model.ts
import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";

class Camera extends Model<InferAttributes<Camera>, InferCreationAttributes<Camera>> {
  declare id: CreationOptional<number>;
  declare user_id: ForeignKey<number>;
  declare name: string;
  declare source_type: "RTSP" | "RTMP" | "HLS" | "WebRTC" | "YouTube" | "Twitch" | "MJPEG" | "DASH" | "Other";
  declare source_url: string;
  declare playback_url: CreationOptional<string>;
  declare status: CreationOptional<"active" | "inactive" | "pending">;
  declare location: CreationOptional<string>;
  declare latitude: CreationOptional<string>;
  declare longitude: CreationOptional<string>;
  declare storage_info: CreationOptional<string>;
  declare additional_data: CreationOptional<string>;
  declare is_public: CreationOptional<boolean>;
}

export default (sequelize: Sequelize) => {
  return Camera.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      source_type: {
        type: DataTypes.ENUM("RTSP", "RTMP", "HLS", "WebRTC", "YouTube", "Twitch", "MJPEG", "DASH", "Other"),
        allowNull: false,
      },
      source_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      playback_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "pending"),
        allowNull: false,
        defaultValue: "pending",
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      storage_info: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      additional_data: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "cameras",
      sequelize,
      charset: "utf8",
      collate: "utf8_unicode_ci",
      timestamps: false,
      freezeTableName: true,
    }
  );
};
