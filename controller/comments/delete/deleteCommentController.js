import {
  decCommentCount,
  isCommentCountZero,
} from "../../../model/PostAnalytics/quries.js";
import { deleteSinglePostComment } from "../../../model/PostComments/quiries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
export const deleteCommentController = catchAsync(async (req, res, next) => {
  const { userId, commentId, postId } = req.body;

  if (!userId || !commentId || !postId) {
    return next(
      new AppError(
        `Please send all required fields. userId,commentId,postId`,
        400
      )
    );
  }

  //delete comment from post_comments table
  const result = await deleteSinglePostComment({userId, commentId});
  //decrease the comment count in post_analytics table if it is not zero
  const isCommentCount = await isCommentCountZero(postId);
  // console.log("isCommentCountZero ===> ",isCommentCount)
  if (!isCommentCount) {
    await decCommentCount(postId);
  }

  // console.log("result from deleteSinglePostComment ===> ", result);

  if (!result) {
    return res.sendStatus(304);
  }

  return res.status(200).send({
    message: "comment deleted!",
    commentId
  });
});
