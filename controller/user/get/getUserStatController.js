import { getTotalOwnPostCommentsCount } from "../../../model/PostComments/quiries.js";
import {
  getAllUserPosts,
  getTotalOwnPostsLikesCount,
} from "../../../model/Posts/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const getUserStatController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return next(new AppError(`userId is not present`, 400));
  }

  const formattedUserId = parseInt(userId);

  if (!isPositiveInteger(formattedUserId)) {
    return next(new AppError(`userId must be number`));
  }

  const totalOwnPosts = await getAllUserPosts({ userId });
  const totalOwnPostsCount = totalOwnPosts.length;

  if (totalOwnPostsCount <= 0) {
    return res.status(200).send({
      message: "no posts found !",
      total_post_count: 0,
      total_likes_count: 0,
      total_post_comments: 0,
    });
  }

  const totalOwnPostsLikes = await getTotalOwnPostsLikesCount({ userId });
  const totalOwnPostsComments = await getTotalOwnPostCommentsCount({
    userId,
  });

  return res.status(200).send({
    message: "posts found !",
    totalPosts: totalOwnPostsCount,
    totalLikes: totalOwnPostsLikes,
    totalComments: totalOwnPostsComments,
  });
});
