import { getTotalOwnPostCommentsCount } from "../../../model/PostComments/quiries.js";
import {
  getAllUserPosts,
  getTotalOwnPostsLikesCount,
} from "../../../model/Posts/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const getUserStatController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return next(new AppError(`userId is not present`, 400));
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
    total_post_count: totalOwnPostsCount,
    total_likes_count: totalOwnPostsLikes,
    total_post_comments: totalOwnPostsComments,
  });
});
