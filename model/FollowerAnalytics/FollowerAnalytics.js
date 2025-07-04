import sq from "../../db.js";
import { DataTypes } from "@sequelize/core";

export const FollowerAnalytics = sq.define(
  "follower_analytics",
  {
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "user id can not be empty.",
        },
      },
    },

    followers: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    following: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);
