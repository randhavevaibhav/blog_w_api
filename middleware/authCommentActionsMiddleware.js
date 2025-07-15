import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { isCommentBelongsToUser } from "../model/PostComments/quires.js";

export const authCommentActionsMiddleware = catchAsync(
  async (req, res, next) => {
    const authHeader = req.headers[`authorization`];
    let userId = null;
    const commentId = req.params.commentId
      ? req.params.commentId
      : req.body.commentId;

    if (!commentId) {
      return next(new AppError(`please send all required field commentId`));
    }

    const accessToken = authHeader.split(" ")[1];

    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return next(new AppError(`access forbidden`, 403));
        }
        userId = decoded.userId;
        // console.log("userId ====> ", userId);
        const resultCommentAuth = await isCommentBelongsToUser({
          userId: userId,
          commentId,
        });

        if (!resultCommentAuth) {
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
