import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";


export const authCommentActionsMiddleware = catchAsync(
  async (req, res, next) => {
    const authHeader = req.headers[`authorization`];
    const userId = req.params.userId ? req.params.userId : req.body.userId;

    if (!userId) {
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
        
    
        if (parseInt(decoded.userId) !== parseInt(userId)) {
          return next(
            new AppError(
              `access forbidden. This comment does not belongs to you !`,
              403
            )
          );
        }
        next();
      }
    );
  }
);
