import sq from "../../db.js";
import { DataTypes } from "@sequelize/core";


export const PostHashtags = sq.define(
  "post_hashtags",
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
    hashtag_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "hashtag id can not be empty.",
        },
      },
    },
 
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

