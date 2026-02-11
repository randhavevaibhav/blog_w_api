import { catchAsync } from "../../../utils/catchAsync.js";
import { AppError } from "../../../utils/appError.js";
import {
  checkIfUserExistWithId,
  getUserInfo,
} from "../../../model/Users/quires.js";

export const getUserInfoController = catchAsync(async (req, res, next) => {
  let recentPost = null;
  let recentComment = null;

  const { userId } = req.params;

  const isUserExist = await checkIfUserExistWithId({ userId });
  if (!isUserExist) {
    return next(new AppError(`User with id ${userId} does not exist.`, 404));
  }

  const currentUserId = req.user?.userId || null;

  const result = await getUserInfo({
    userId,
    currentUserId,
  });

  const userInfo = {
    userId: result.userId,
    email: result.email,
    firstName: result.firstName,
    profileImgURL: result.profileImgURL,
    registeredAt: result.registeredAt,
    skills: result.skills,
    websiteURL: result.websiteURL,
    location: result.location,
    totalUserPosts: result.totalUserPosts,
    totalUserComments: result.totalUserComments,
    totalUserFollowers: result.totalUserFollowers,
    totalUserFollowings: result.totalUserFollowings,
    totalOwnPostsLikes: result.totalOwnPostsLikes,
    isFollowed: result.isFollowed,
    isMutual:result.isMutual,
    isFollowing:result.isFollowing
  };

  if (result.recentPostId)
    recentPost = {
      postId: result.recentPostId,
      createdAt: result.recentPostCreatedAt,
      titleImgURL: result.titleImgURL,
      title: result.title,
      userId: result.recentPostUserId,
      likes: result.recentPostLikes,
      comments: result.recentComments,
    };

  if (result.commentId) {
    recentComment = {
      commentId: result.commentId,
      userId: result.postCommentUserId,
      postId: result.recentCommentPostId,
      createdAt: result.recentCommentCreatedAt,
      content: result.content,
      parentId: result.parentId,
      authorId: result.postAuthorUserId,
      titleImgURL: result.recentCommentPostTitleImgURL,
    };
  }

  return res.status(200).json({
    message: "Fetched user info.",
    userInfo,
    recentPost,
    recentComment,
  });
});
