import sq from "../../db.js";
import { DataTypes } from "@sequelize/core";
import { Posts } from "../Posts/Posts.js";

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


Bookmarks.belongsTo(Posts,{
  targetKey:"id",
  foreignKey:"post_id"
});
