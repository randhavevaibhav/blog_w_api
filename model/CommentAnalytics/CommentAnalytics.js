import sq from "../../db.js";
import { DataTypes } from "@sequelize/core";

export const CommentAnalytics = sq.define(
  "comment_analytics",
  {
    comment_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "comment id can not be empty.",
        },
      },
    },

    likes: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);
