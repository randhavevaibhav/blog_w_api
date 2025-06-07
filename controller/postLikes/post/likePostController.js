import { incPostLike } from "../../../model/PostAnalytics/quries.js";
import {
  createPostLike,
  isPostLikedByUser,
} from "../../../model/PostLikes/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const likePostController = catchAsync(async (req, res, next) => {
  const { userId, postId, createdAt } = req.body;

  if (!userId || !postId || !createdAt) {
    return next(
      new AppError(`Please send all required fields. userId,postId,createdAt.`)
    );
  }

  //check if post is already liked by user
  const isPostLiked = await isPostLikedByUser({ userId, postId });

  if (isPostLiked) {
    return res.status(304).send({
      message: "post already liked",
      liked: true,
    });
  }

  //if not like post
  const createPostLikeResult = await createPostLike({
    userId,
    postId,
    createdAt,
  });

  const incPostLikeResult = await incPostLike(postId);
  return res.status(200).send({
    message: "liked a post !",
    liked: true,
  });
});
