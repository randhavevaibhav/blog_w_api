import {
  decCommentLike,
  getCommentAnalytics,
} from "../../../model/CommentAnalytics/quries.js";
import { removeCommentLike } from "../../../model/CommentLikes/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const dislikeCommentController = catchAsync(async (req, res, next) => {
  const { commentId, userId } = req.body;

  if (!commentId || !userId) {
    return next(
      new AppError(`Please send all required fields. commentId,userId.`, 400)
    );
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
