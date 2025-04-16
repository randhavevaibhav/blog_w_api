import sq from "../../db.js";
import { DataTypes } from "@sequelize/core";
import { Users } from "../Users/Users.js";

export const PostComments = sq.define(
  "post_comments",
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
    post_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "post id can not be empty.",
        },
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "content can not be empty.",
        },
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "created at can not be empty.",
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

PostComments.belongsTo(Users, { foreignKey: "user_id" });
