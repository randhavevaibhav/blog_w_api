import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";
import { getRefreshToken } from "../model/Users/quries.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers[`authorization`];
  const persistHeader = req.headers[`x-persist`];
  // const cookies = req.cookies;
  // console.log("headers ===> ", req.headers);
  // console.log("persistHeader ===> ", persistHeader);
  const isPersist = persistHeader === `persist` ? true : false;

  if (!authHeader) {
    return next(new AppError(`JWT cookie not present.`, 401));
  }
  if (!persistHeader) {
    return next(new AppError(`persistHeader not present.`, 401));
  }

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SCERET,
    async (err, decoded) => {
      if (err) {
        return next(new AppError(`access forbidden`, 403));
      }
      const refreshToken = await getRefreshToken({
        userId: decoded.userId,
      });
      // console.log("refreshToken ==> ", refreshToken);
      if (!refreshToken && isPersist) {
        return next(
          new AppError(`access forbidden`, 403, {
            terminate: true,
          })
        );
      }
      //all went well
      // console.log("decoded.userId ====> ", decoded.userId);
      next();
    }
  );
};
