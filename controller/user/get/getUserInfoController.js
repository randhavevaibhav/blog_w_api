import { catchAsync } from "../../../utils/catchAsync.js";
import { AppError } from "../../../utils/appError.js";
import {
  checkIfUserExistWithId,
  getUserInfo,
} from "../../../model/Users/quires.js";

import { getAllPostHashtags } from "../../../model/PostHashtags/quires.js";
import {
  getTotalOwnPostsLikesCount,
  getUserRecentPost,
} from "../../../model/Posts/quires.js";
import { getOwnRecentComment } from "../../../model/PostComments/quires.js";
export const getUserInfoController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const isUserExist = await checkIfUserExistWithId({ userId });
  if (!isUserExist) {
    return next(new AppError(`User with id ${userId} does not exist.`, 404));
  }

  const currentUserId = req.user?.userId || null;

  const [
    userInfoResult,
    totalOwnPostsLikes,
    userRecentPost,
    userRecentComment,
  ] = await Promise.all([
    getUserInfo({ userId, currentUserId }),
    getTotalOwnPostsLikesCount({ userId }),
    getUserRecentPost({ userId }),
    getOwnRecentComment({ userId }),
  ]);

 
  const userInfo = {
    ...userInfoResult, 
    isFollowed: !!userInfoResult["followers.id"],
    totalUserFollowers: userInfoResult["analytics.followers"] || 0,
    totalUserFollowings: userInfoResult["analytics.following"] || 0,
    totalOwnPostsLikes,
  };

  let recentPost = null;
  if (userRecentPost) {
    const tagList = await getAllPostHashtags({ postId: userRecentPost.postId });
    recentPost = {
      postId: userRecentPost.postId,
      userId: userRecentPost.userId,
      title: userRecentPost.title,
      createdAt: userRecentPost.createdAt,
      titleImgURL: userRecentPost.titleImgURL,
      tagList,
      likes: userRecentPost["post_analytics.likes"] || 0,
      comments: userRecentPost["post_analytics.comments"] || 0,
    };
  }

  const recentComment = userRecentComment
    ? {
        commentId: userRecentComment.commentId,
        userId: userRecentComment.userId,
        postId: userRecentComment.postId,
        content: userRecentComment.content,
        parentId: userRecentComment.parentId,
        createdAt: userRecentComment.createdAt,
        authorId: userRecentComment.authorId,
      }
    : null;

  return res.status(200).json({
    message: "Fetched user info.",
    userInfo,
    recentPost,
    recentComment,
  });
});
