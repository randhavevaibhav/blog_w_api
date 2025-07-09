import { decCommentCount } from "../../../model/PostAnalytics/quries.js";
import {
  deleteSinglePostComment,
  updateCommentAsGhost,
} from "../../../model/PostComments/quiries.js";
import { decUserCommentsCount } from "../../../model/Users/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { isPositiveInteger } from "../../../utils/utils.js";
export const deleteCommentController = catchAsync(async (req, res, next) => {
  const { userId, commentId, postId, hasReplies } = req.params;

  const numHasReplies = parseInt(hasReplies);

  if (!userId || !commentId || !postId) {
    return next(
      new AppError(
        `Please send all required fields. userId,commentId,postId`,
        400
      )
    );
  }

  const formattedUserId = parseInt(userId);
  const formattedPostId = parseInt(postId);
  const formattedCommentId = parseInt(commentId);

  if (
    !isPositiveInteger(formattedUserId) ||
    !isPositiveInteger(formattedPostId) ||
    !isPositiveInteger(formattedCommentId)
  ) {
    return next(new AppError(`userId, postId, commentId must be numbers`));
  }

  let result = null;
  let ghosted = false;

  //decrease the comment count in post_analytics table if it is not zero

  await decUserCommentsCount({
    userId,
  });

  if (!numHasReplies) {
    await decCommentCount(postId);
    result = await deleteSinglePostComment({ userId, commentId });
  }

  if (numHasReplies) {
    ghosted = true;
    await updateCommentAsGhost({ commentId, postId });
  }

  // console.log("result from deleteSinglePostComment ===> ", result);

  if (!result && !ghosted) {
    return res.sendStatus(304);
  }

  return res.status(200).send({
    message: "comment deleted!",
    commentId,
  });
});
