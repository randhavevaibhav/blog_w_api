import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { isCommentBelongsToUser } from "../model/PostComments/quiries.js";

export const authCommentActionsMiddleware = catchAsync(
  async (req, res, next) => {
    const authHeader = req.headers[`authorization`];
    let userId = null;
    const commentId = req.params.commentId
      ? req.params.commentId
      : req.body.commentId;
    
    if (!commentId) {
      return next(new AppError(`please send all required field commnetId`));
    }

    const accessToken = authHeader.split(" ")[1];

    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SCERET,
      async (err, decoded) => {
       
        // console.log("decoded ====> ", decoded);
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
