import sq from "../../db.js";
import { DataTypes } from "@sequelize/core";

export const CommentLikes = sq.define(
  "comment_likes",

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
    comment_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "comment id can not be empty.",
        },
      },
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "created_at can not be empty.",
        },
      },
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);
