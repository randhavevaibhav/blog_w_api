import {
  decCommentLike,
  getCommentAnalytics,
} from "../../../model/CommentAnalytics/quries.js";
import {
  isCommentLikedByUser,
  removeCommentLike,
} from "../../../model/CommentLikes/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const dislikeCommentController = catchAsync(async (req, res, next) => {
  const { commentId, userId } = req.body;

  if (!commentId || !userId) {
    return next(
      new AppError(`Please send all required fields. commentId,userId.`, 400)
    );
  }
  const formattedCommentId = parseInt(commentId);
  const formattedUserId = parseInt(userId);

  if (
    !isPositiveInteger(formattedUserId) ||
    !isPositiveInteger(formattedCommentId)
  ) {
    return next(new AppError(`userId, commentId must be numbers`));
  }

  const isCommentLiked = await isCommentLikedByUser({ userId, commentId });

  if (!isCommentLiked) {
    return res.status(406).send({
      message: "comment already disliked",
      liked: true,
    });
  }

  const totalCommentLikes = await getCommentAnalytics({ commentId });
  // console.log("totalLikes ===> ",Number(totalLikes.likes));

  if (Number(totalCommentLikes.likes) > 0) {
    const removeCommentLikeResult = await removeCommentLike({
      userId,
      commentId,
    });
    const decCommentLikeResult = await decCommentLike({ commentId });
    // console.log("result in decCommentLikeResult =======> ",decCommentLikeResult);

    return res.status(200).send({
      message: "un-liked a comment !",
      liked: false,
    });
  } else {
    return res.sendStatus(304);
  }
});
