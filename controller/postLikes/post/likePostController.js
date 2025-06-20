import { incPostLike } from "../../../model/PostAnalytics/quries.js";
import {
  createPostLike,
  checkIfPostLikedByUser,
} from "../../../model/PostLikes/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const likePostController = catchAsync(async (req, res, next) => {
  const { userId, postId, createdAt } = req.body;

  if (!userId || !postId || !createdAt) {
    return next(
      new AppError(`Please send all required fields. userId,postId,createdAt.`)
    );
  }
  const formattedUserId = parseInt(userId);
  const formattedPostId = parseInt(postId);

  if (
    !isPositiveInteger(formattedUserId) ||
    !isPositiveInteger(formattedPostId)
  ) {
    return next(new AppError(`userId, postId must be numbers`));
  }

  //check if post is already liked by user
  const isPostLiked = await checkIfPostLikedByUser({ userId, postId });

  if (isPostLiked) {
    //already liked !
    return res.sendStatus(204)
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
