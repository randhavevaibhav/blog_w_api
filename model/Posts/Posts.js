import sq from "../../db.js";
import { DataTypes } from "@sequelize/core";

export const Posts = sq.define(
  "posts",
  {
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "userId can not be empty.",
        },
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "title can not be empty.",
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
          msg: "created_at can not be empty.",
        },
      },
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
