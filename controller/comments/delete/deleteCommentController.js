import {
  decCommentCount,
  isCommentCountZero,
} from "../../../model/PostAnalytics/quries.js";
import {
  deleteAllCmtReplies,
  deleteSinglePostComment,
  updateCommentAsGhost,
} from "../../../model/PostComments/quiries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
export const deleteCommentController = catchAsync(async (req, res, next) => {
  const { userId, commentId, postId, hasReplies } = req.body;

  const numHasReplies = Number(hasReplies)

  if (!Number(userId) || !Number(commentId) || !Number(postId)) {
    return next(
      new AppError(
        `Please send all required fields. userId,commentId,postId`,
        400
      )
    );
  }
  let result = null;
  let ghosted = false;

  //decrease the comment count in post_analytics table if it is not zero
  const isCommentCount = await isCommentCountZero(postId);
  // console.log("isCommentCountZero ===> ",isCommentCount)

  // if (parentId) {
  //   const deleteAllCmtRepliesResult = await deleteAllCmtReplies({ commentId });
  // }

  if (!isCommentCount && !numHasReplies) {
    await decCommentCount(postId);
    result = await deleteSinglePostComment({ userId, commentId });
  }

  if (numHasReplies) {
    ghosted=true
    await updateCommentAsGhost({ commentId, postId });
  }

 

  // console.log("result from deleteSinglePostComment ===> ", result);

  if (!result&&!ghosted) {
    return res.sendStatus(304);
  }

  return res.status(200).send({
    message: "comment deleted!",
    commentId,
  });
});
