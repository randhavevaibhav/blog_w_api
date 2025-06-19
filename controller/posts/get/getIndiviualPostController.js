import { checkIfPostLikedByUser } from "../../../model/PostLikes/quries.js";
import { getPost } from "../../../model/Posts/quries.js";

import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { checkIfAlreadyBookmarked } from "../../../model/Bookmark/quries.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const getIndiviualPostController = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const postId = req.params.postId;
  const currentUserId = req.params.currentUserId;

  if (!userId || !postId) {
    return next(new AppError(`Please send all required fields. userId,postId`));
  }

  const formattedUserId = parseInt(userId);
  const formattedPostId = parseInt(postId);

  if (
    !isPositiveInteger(formattedUserId) ||
    !isPositiveInteger(formattedPostId)
  ) {
    return next(new AppError(`userId, postId must be numbers`));
  }

  const postResult = await getPost({ postId });

  if (!postResult) {
    return res.status(404).send({
      message: "Post not found !!",
    });
  }
  let postlikedByUser = false;
  let postBookmarked = false;
  let postData = null;

  if (currentUserId) {
    const isPostLikedByUser = await checkIfPostLikedByUser({
      userId: currentUserId,
      postId,
    });

    const isPostBookmarked = await checkIfAlreadyBookmarked({
      userId: currentUserId,
      postId,
    });
    if (isPostBookmarked) {
      postBookmarked = true;
    }
    if (isPostLikedByUser) {
      postlikedByUser = true;
    }
  }

  postData = {
    userName: postResult.first_name,
    userProfileImg: postResult.profile_img_url,
    userLocation: postResult.location,
    userEmail: postResult.email,
    userJoinedOn: postResult.registered_at,
    title: postResult.title,
    content: postResult.content,
    titleImgURL: postResult.title_img_url,
    totalLikes: postResult.likes,
    createdAt: postResult.created_at,
    totalComments: postResult.comments,
    postlikedByUser,
    postBookmarked,
  };

  return res.status(200).send({
    message: `post fetched.`,
    postData,
  });
});
