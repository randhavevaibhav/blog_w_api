import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers[`authorization`];
  if (!authHeader) {
    return next(new AppError(`JWT cookie not present.`, 401));
  }

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SCERET, (err, decoded) => {
    if (err) {
      return next(new AppError(`access forbidden`, 403));
    }
    //all went well
    // console.log("decoded.userId ====> ", decoded.userId);
    next();
  });
};
