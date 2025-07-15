import sq from "../../db.js";
import { DataTypes } from "@sequelize/core";

export const Hashtags = sq.define(
  "hashtags",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "hashtag can not be empty.",
        },
      },
    },
    info: {
      type: DataTypes.STRING,
      allowNull: true,
    },
     color: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

