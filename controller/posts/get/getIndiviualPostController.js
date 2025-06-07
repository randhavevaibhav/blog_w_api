import { isPostLikedByUser } from "../../../model/PostLikes/quries.js";
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

  let likedByUser = false;
  let bookmarked = false;

  let commentTree = [];

  const postResult = await getPost({ postId });

  if (!postResult) {
    return res.status(404).send({
      message: "Post not found !!",
    });
  }

  const isLikedByUser = await isPostLikedByUser({
    userId: currentUserId,
    postId,
  });

  const isBookmarked = await checkIfAlreadyBookmarked({
    userId: currentUserId,
    postId,
  });

  const commentsResult = await getAllPostComments({ postId });

  const constructCommentTree = (commentsArr) => {
    // console.log("commentsArr ===> ", commentsArr);

    return Promise.all(
      commentsArr.map(async (comment) => {
        // console.log("comment.id ==> ", comment.id);

        const repliesResult = await getReplies({
          commentId: comment.id,
        });
        // console.log("repliesResult ==> ",repliesResult)
        const repliesArr = repliesResult.map((reply) => {
          return {
            id: reply.id,
            content: reply.content,
            created_at: reply.created_at,
            likes: reply.likes,
            userName: reply.users.first_name,
            userProfileImg: reply.users.profile_img_url,
            userId: reply.users.id,
            parentId: reply.parent_id,
          };
        });
        return {
          ...comment,
          replies: await constructCommentTree(repliesArr),
        };
      })
    );
  };

  if (commentsResult.length) {
    Promise.all(
      commentsResult.map(async (comment) => {
        const commetLikes = await getCommentAnalytics({
          commentId: comment.id,
        });
        const isLikedByUser = await isCommentLikedByUser({
          userId: currentUserId,
          commentId: comment.id,
        });
        return {
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          likes: Number(commetLikes.likes),
          isLikedByUser: isLikedByUser ? true : false,
          userName: comment.users.first_name,
          userProfileImg: comment.users.profile_img_url,
          userId: comment.users.id,
          parentId: comment.parent_id,
        };
      })
    )
      .then(async (arr) => {
        commentTree = await constructCommentTree(arr);

        commentTree = commentTree.filter((comment) => comment.parentId == null);

        if (isLikedByUser) {
          likedByUser = true;
        }
        if (isBookmarked) {
          bookmarked = true;
        }

        const postData = {
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
          comments: commentTree,
        };
        // console.log("postData  postResult ===> ", postData);

        return res.status(200).send({
          message: `post fetched.`,
          postData: { ...postData, likedByUser, bookmarked },
        });
      })
      .catch((err) => {
        next(err);
      });
  }
});
