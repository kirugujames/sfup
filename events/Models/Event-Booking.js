import { DataTypes } from "sequelize";
import sequelize from "../../database/database.js";
import MemberRegistration from "../../member-registration/models/memberRegistration.js";
import Events from "./Event.js";

const Event_Booking = sequelize.define(
  "Event_Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    member_code: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: MemberRegistration,
        key: "member_code",
      },
      onDelete: "CASCADE",
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Events,
        key: "id", 
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "event_booking",
    timestamps: true,
  }
);

Events.hasMany(Event_Booking, { foreignKey: "event_id", onDelete: "CASCADE" });
Event_Booking.belongsTo(Events, { foreignKey: "event_id" });

MemberRegistration.hasMany(Event_Booking, {
  foreignKey: "member_code",
  onDelete: "CASCADE",
});
Event_Booking.belongsTo(MemberRegistration, { foreignKey: "member_code" });

export default Event_Booking;
