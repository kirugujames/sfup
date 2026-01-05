import { DataTypes, Model } from "sequelize";
import sequelize from "../../database/database.js";

class Role extends Model {}

Role.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    role_name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  {
    sequelize,
    modelName: "Role",
    tableName: "role",
    timestamps: false,
  }
);

export default Role;
