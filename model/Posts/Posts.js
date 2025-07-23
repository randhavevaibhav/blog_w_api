import sq from "../../db.js";
import { DataTypes } from "@sequelize/core";

import { Users } from "../Users/Users.js";


export const Posts = sq.define(
  "posts",
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
    title_img_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

Posts.belongsTo(Users, { foreignKey: "user_id" });

