import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";
import { getRefreshToken } from "../model/Users/quires.js";

export const requireAuth = (req, res, next) => {
  const cookies = req.cookies;
  const clientRefreshToken = cookies.jwt;

  const authHeader = req.headers[`authorization`];

  if (!authHeader) {
    return next(new AppError(`JWT cookie not present.`, 401));
  }

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return next(new AppError(`access forbidden`, 403));
      }
      const dbRefreshToken = await getRefreshToken({
        userId: decoded.userId,
      });

      if (!dbRefreshToken) {
        return next(
          new AppError(`access forbidden`, 403, {
            reason: "db refresh token is not present",
            terminate: true,
          })
        );
      }

      if (dbRefreshToken && dbRefreshToken != clientRefreshToken) {
        return next(
          new AppError(`access forbidden`, 403, {
            reason: "db refresh token is not equal to client refersh token",
            terminate: true,
          })
        );
      }
      //all went well
      // console.log("decoded.userId ====> ", decoded.userId);
      req.user = {userId:decoded.userId};
      next();
    }
  );
};
