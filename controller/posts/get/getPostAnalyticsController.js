import { checkIfPostLikedByUser } from "../../../model/PostLikes/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { checkIfAlreadyBookmarked } from "../../../model/Bookmark/quires.js";
import { checkIfAlreadyFollowed } from "../../../model/Followers/quires.js";
import { getPostAnalytics } from "../../../model/PostAnalytics/quires.js";

export const getPostAnalyticsController = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const postId = req.params.postId;
 
  let postLikedByUser = false;
  let postBookmarked = false;
  let isFollowed = false;

  const postAnalytics = await getPostAnalytics({ postId });

  if (req.user) {
    const {userId:currentUserId} = req.user;
    const isPostLikedByUser = await checkIfPostLikedByUser({
      userId: currentUserId,
      postId,
    });

    const isPostBookmarked = await checkIfAlreadyBookmarked({
      userId: currentUserId,
      postId,
    });

    const isAlreadyFollowed = await checkIfAlreadyFollowed({
      userId: currentUserId,
      followingUserId: userId,
    });
    if (isAlreadyFollowed) {
      isFollowed = true;
    }

    if (isPostBookmarked) {
      postBookmarked = true;
    }
    if (isPostLikedByUser) {
      postLikedByUser = true;
    }
  }

  return res.status(200).send({
    message: `fetched post analytics.`,
    postAnalytics: {
      totalComments: postAnalytics?.comments,
      totalLikes: postAnalytics?.likes,
      postBookmarked,
      postLikedByUser,
      isFollowed,
    },
  });
});
