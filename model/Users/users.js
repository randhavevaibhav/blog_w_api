import sq from "../../db.js";
import { DataTypes } from "@sequelize/core";
// IMp to add
// {
//     createdAt: false,
//     updatedAt: false,
//   }
//as 3rd argument to define

export const Users = sq.define(
  "users",
  {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
            msg:"first_name can not be empty."
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
            msg:"email can not be empty." 
        },
        isEmail: {
            msg:"please provided proper mail."
        },
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
            msg:"password_hash can not be empty." 
        },
      },
    },
    registered_at: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
            msg:"registered_at can not be empty." 
        },
        isDate: {
            msg:"please provided proper date."
        },
      },
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);
