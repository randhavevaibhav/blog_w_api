import { checkIfPostLikedByUser } from "../../../model/PostLikes/quries.js";
import { getPost } from "../../../model/Posts/quries.js";
import {
  getAllPostComments,
  getReplies,
} from "../../../model/PostComments/quiries.js";

import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { checkIfAlreadyBookmarked } from "../../../model/Bookmark/quries.js";
import { getCommentAnalytics } from "../../../model/CommentAnalytics/quries.js";
import { isCommentLikedByUser } from "../../../model/CommentLikes/quries.js";

export const getIndiviualPostController = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const postId = req.params.postId;
  const currentUserId = req.params.currentUserId;

  if (!userId || !postId || !currentUserId) {
    return next(
      new AppError(
        `Please send all required fields. userId,currentUserId,postId`
      )
    );
  }

  if (!Number(userId) || !Number(postId) || !Number(currentUserId)) {
    return next(
      new AppError(`Please send correct user id, post id, current user id`)
    );
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

  const isPostLikedByUser = await checkIfPostLikedByUser({
    userId: currentUserId,
    postId,
  });

  const isPostBookmarked = await checkIfAlreadyBookmarked({
    userId: currentUserId,
    postId,
  });
  if (isPostLikedByUser) {
    postBookmarked = true;
  }
  if (isPostBookmarked) {
    postlikedByUser = true;
  }

  postData = {
    userName: postResult.first_name,
    userProfileImg: postResult.profile_img_url,
    userLocation: postResult.location,
    userEmail: postResult.email,
    userJoinedOn: postResult.registered_at,
    title: postResult.title,
    content: postResult.content,
    title_img_url: postResult.title_img_url,
    totalLikes: postResult.likes,
    created_at: postResult.created_at,
    totalComments: postResult.comments,
    postlikedByUser,
    postBookmarked,
  };

  const commentsResult = await getAllPostComments({ postId });

  const getComments = (commentArr) => {
    return commentArr.map(async (comment) => {
      let replies = [];
      const commetLikes = await getCommentAnalytics({
        commentId: comment.id,
      });
      const isCmtLikedByUser = await isCommentLikedByUser({
        userId: currentUserId,
        commentId: comment.id,
      });
      const repliesResult = await getReplies({
        commentId: comment.id,
      });

      await Promise.all(getComments(repliesResult))
        .then((arr) => {
          replies = arr;
        })
        .catch((err) => {
          next(err);
        });

      return {
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        likes: commetLikes ? commetLikes.likes : 0,
        isCmtLikedByUser: isCmtLikedByUser ? true : false,
        userName: comment.users.first_name,
        userProfileImg: comment.users.profile_img_url,
        userId: comment.users.id,
        parentId: comment.parent_id,
        replies,
      };
    });
  };

  if (commentsResult.length) {
    Promise.all(getComments(commentsResult))
      .then(async (arr) => {
        return res.status(200).send({
          message: `post fetched.`,
          postData: {
            ...postData,
            comments: arr.filter((comment) => comment.parentId === null),
          },
        });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    return res.status(200).send({
      message: `post fetched.`,
      postData: { ...postData, comments: [] },
    });
  }
});
