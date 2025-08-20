import { catchAsync } from "../../../utils/catchAsync.js";
import { AppError } from "../../../utils/appError.js";
import {
  checkIfUserExistWithId,
  getTotalCommentCountOfUser,
  getTotalUserPosts,
  getUserInfo,
} from "../../../model/Users/quires.js";
import { getUserRecentPost } from "../../../model/Posts/quires.js";
import { getOwnRecentComment } from "../../../model/PostComments/quires.js";
import { isPositiveInteger } from "../../../utils/utils.js";
import { checkIfAlreadyFollowed } from "../../../model/Followers/quires.js";
import { getFollowerAnalytics } from "../../../model/FollowerAnalytics/quires.js";
import { getAllPostHashtags } from "../../../model/PostHashtags/quires.js";
export const getUserInfoController = catchAsync(async (req, res, next) => {
  const { userId, currentUserId } = req.params;
  let isFollowed = false;
  let totalUserPosts = 0;
  let totalUserComments = 0;
  let totalUserFollowers = 0;
  let totalUserFollowings = 0;
  let userRecentPost = null;
  let userRecentComment = null;
  let formattedRecentPost = null;
  let formattedUserInfo = null;
  let formattedRecentComment = null;

  if (!userId) {
    return next(new AppError(`Please send all required field. userId`, 400));
  }

  const formattedUserId = parseInt(userId);

  if (!isPositiveInteger(formattedUserId)) {
    return next(new AppError(`userId must be number`));
  }

  const isUserExist = await checkIfUserExistWithId({ userId });

  if (!isUserExist) {
    return next(new AppError(`User with id ${userId} does not exist.`, 404));
  }

  if (currentUserId) {
    const formattedCurrentUserId = parseInt(currentUserId);
    if (!isPositiveInteger(formattedCurrentUserId)) {
      return next(new AppError(`currentUserId must be number`));
    }
    const isAlreadyFollowed = await checkIfAlreadyFollowed({
      userId: currentUserId,
      followingUserId: userId,
    });
    if (isAlreadyFollowed) {
      isFollowed = true;
    }
  }

  const getUserFollowerAnalyticsResult = await getFollowerAnalytics({
    userId,
  });

  if (getUserFollowerAnalyticsResult) {
    totalUserFollowers = getUserFollowerAnalyticsResult.followers;
    totalUserFollowings = getUserFollowerAnalyticsResult.following;
  }

  // console.log("user info =====> ", formattedUserInfo);

  userRecentPost = await getUserRecentPost({ userId });
  if (userRecentPost) {
    formattedRecentPost = {
      postId: userRecentPost.id,
      userId: userRecentPost.user_id,
      title: userRecentPost.title,
      tagList: await getAllPostHashtags({
        postId:userRecentPost.id
      }),
      createdAt: userRecentPost.created_at,
      titleImgURL: userRecentPost.title_img_url,
      likes: userRecentPost.post_analytics?.likes,
      comments: userRecentPost.post_analytics?.comments,
    };
  }
  userRecentComment = await getOwnRecentComment({ userId });

  if (userRecentComment) {
    formattedRecentComment = {
      commentId: userRecentComment.id,
      userId: userRecentComment.user_id,
      postId: userRecentComment.post_id,
      content: userRecentComment.content,
      parentId: userRecentComment.parent_id,
      createdAt: userRecentComment.created_at,
      authorId: userRecentComment.author_id
    };
  }
  let totalUserPostsResult = await getTotalUserPosts({ userId });
  let totalUserCommentsResult = await getTotalCommentCountOfUser({ userId });
  totalUserPosts = totalUserPostsResult.dataValues.posts;
  totalUserComments = totalUserCommentsResult.dataValues.comments;

  const userInfo = await getUserInfo({ userId });

  formattedUserInfo = {
    userId,
    firstName: userInfo.first_name,
    email: userInfo.email,
    registeredAt: userInfo.registered_at,
    profileImgURL: userInfo.profile_img_url,
    bio: userInfo.bio,
    skills: userInfo.skills,
    websiteURL: userInfo.website_url,
    location: userInfo.location,
    isFollowed,
    totalUserFollowers,
    totalUserFollowings,
    totalUserPosts,
    totalUserComments,
  };

  return res.status(200).send({
    message: `fetched user info.`,
    userInfo: formattedUserInfo,
    recentPost: formattedRecentPost,
    recentComment: formattedRecentComment,
  });
});
