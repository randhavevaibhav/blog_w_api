import {
  checkIfPostLikedByUser,
  removeUserPostLike,
} from "../../../model/PostLikes/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const dislikePostController = catchAsync(async (req, res, next) => {
  const { userId, postId } = req.body;

  if (!userId || !postId) {
    return next(
      new AppError(
        `Please send all required fields. userId,postId,createdAt.`,
        400
      )
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

  const isPostLiked = await checkIfPostLikedByUser({ userId, postId });

  if (!isPostLiked) {
    //already dis-liked !
    return res.sendStatus(204);
  }

  const removePostLikeResult = await removeUserPostLike({ userId, postId });

  // console.log("result in removePostLikeResult =======> ",removePostLikeResult);
  // console.log("result in removePostLikeResult =======> ",decPostLikeResult);

  return res.status(200).send({
    message: "un-liked a post !",
    liked: false,
  });
});
