import { JWT_MAX_AGE, JWT_SECRET_KEY } from "./constants.js";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken"


export const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET_KEY, {
    expiresIn: JWT_MAX_AGE,
  });
};


export const incript = async(item)=>{

    const salt = await bcrypt.genSalt();
    const incripteditem = await bcrypt.hash(item, salt);
    return incripteditem;

}

