import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { isPostBelongsToUser } from "../model/Posts/quires.js";

export const authPostActionsMiddleware = catchAsync(async(req, res, next) => {
  const authHeader = req.headers[`authorization`];
  let userId = null;
  const postId = req.params.postId?req.params.postId:req.body.postId;

  if (!postId) {
    return next(new AppError(`please send all required field postId`));
  }

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      //all went well
      // console.log("decoded.userId ====> ", decoded.userId);

      userId = decoded.userId;

      const resultPostAuth = await isPostBelongsToUser({
        userId: userId,
        postId,
      });

      if (!resultPostAuth) {
        return next(new AppError(`access forbidden. This post does not belongs to you !`, 403));
      }
      next();
    }
  );
});
