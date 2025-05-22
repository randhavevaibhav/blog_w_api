import sq from "../../db.js";
import { DataTypes } from "@sequelize/core";

export const Bookmarks = sq.define(
  "bookmarks",
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
   },
   {
     createdAt: false,
     updatedAt: false,
   }
);

