import { getFollowerAnalytics } from "../../../model/FollowerAnalytics/quires.js";
import { getTotalOwnPostsCommentCount } from "../../../model/PostComments/quires.js";
import { getTotalOwnPostsLikesCount } from "../../../model/Posts/quires.js";
import { getTotalUserPosts } from "../../../model/Users/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const getUserStatController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  let totalFollowers = 0;
  let totalFollowings = 0;

  if (!userId) {
    return next(new AppError(`userId is not present`, 400));
  }

  const formattedUserId = parseInt(userId);

  if (!isPositiveInteger(formattedUserId)) {
    return next(new AppError(`userId must be number`));
  }

  const getUserFollowerAnalyticsResult = await getFollowerAnalytics({
    userId,
  });

  if (getUserFollowerAnalyticsResult) {
    totalFollowers = getUserFollowerAnalyticsResult.followers;
    totalFollowings = getUserFollowerAnalyticsResult.following;
  }

  const totalUserPostsResult = await getTotalUserPosts({ userId });
  let totalUserPosts = totalUserPostsResult.dataValues.posts;

  if (totalUserPosts <= 0) {
    return res.status(200).send({
      message: "no posts found !",
      total_post_count: 0,
      total_likes_count: 0,
      total_post_comments: 0,
      totalFollowers,
      totalFollowings,
    });
  }

  const totalOwnPostsLikes = await getTotalOwnPostsLikesCount({ userId });
  const totalOwnPostsComments = await getTotalOwnPostsCommentCount({
    userId,
  });

  return res.status(200).send({
    message: "posts found !",
    totalPosts: totalUserPosts,
    totalLikes: totalOwnPostsLikes,
    totalComments: totalOwnPostsComments,
    totalFollowers,
    totalFollowings,
  });
});
