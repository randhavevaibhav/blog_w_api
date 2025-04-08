import {
  decPostLike,
  getPostAnalytics,
} from "../../../model/PostAnalytics/quries.js";
import { removeUserPostLike } from "../../../model/PostLikes/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const dislikePostController = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const postId = req.params.postId;
  const { createdAt } = req.body;

  if (!userId || !postId || !createdAt) {
    return next(
      new AppError(
        `Please send all required fields. userId,postId,createdAt.`,
        400
      )
    );
  }

  const totalLikes = await getPostAnalytics({postId});
  // console.log("totalLikes ===> ",Number(totalLikes.likes));

  if (Number(totalLikes.likes) > 0) {
    const removePostLikeResult = await removeUserPostLike({userId, postId});
    const decPostLikeResult = await decPostLike(postId);
    // console.log("result in removePostLikeResult =======> ",removePostLikeResult);
    // console.log("result in removePostLikeResult =======> ",decPostLikeResult);

    return res.status(200).send({
      message: "un-liked a post !",
      liked: false,
    });
  } else {
    return res.status(304).send({
      message: "invalid",
    });
  }
});
