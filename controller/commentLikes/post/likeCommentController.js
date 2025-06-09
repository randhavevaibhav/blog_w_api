import { incCommentLike } from "../../../model/CommentAnalytics/quries.js";
import {
  createCommentLike,
  isCommentLikedByUser,
} from "../../../model/CommentLikes/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const likeCommentController = catchAsync(async (req, res, next) => {
  const { userId, commentId, createdAt } = req.body;

  if (!commentId || !userId || !createdAt) {
    return next(
      new AppError(
        `Please send all required fields. commentId,userId,createdAt`
      )
    );
  }

  //check if comment is already liked by user
  const isCommentLiked = await isCommentLikedByUser({ userId, commentId });

  if (isCommentLiked) {
    return res.status(200).send({
      message: "comment already liked",
      liked: true,
    });
  }

  //if not like post
  const createPostLikeResult = await createCommentLike({
    userId,
    commentId,
    createdAt,
  });

  const incPostLikeResult = await incCommentLike({ commentId });

  return res.status(200).send({
    message: "liked a comment !",
    liked: true,
  });
});
