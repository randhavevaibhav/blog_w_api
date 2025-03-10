import sq from "../../db.js";
import { DataTypes } from "@sequelize/core";


export const PostAnalytics = sq.define(
  "post_analytics",
  {
    post_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "post id can not be empty.",
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


