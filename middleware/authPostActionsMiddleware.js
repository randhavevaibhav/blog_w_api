import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const authPostActionsMiddleware = catchAsync(async (req, res, next) => {
  const authHeader = req.headers[`authorization`];

  const reqUserId = req.params.userId ? req.params.userId : req.body.userId;

  if (!reqUserId) {
    return next(new AppError(`please send all required field userId`));
  }

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return next(new AppError(`access forbidden`, 403));
      }
      if (parseInt(decoded.userId) !== parseInt(reqUserId)) {
        return next(
          new AppError(
            `access forbidden. This post does not belongs to you !`,
            403
          )
        );
      }

      next();
    }
  );
});
