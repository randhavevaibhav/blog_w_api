import { isPostLikedByUser } from "../../../model/PostLikes/quries.js";
import { getPost } from "../../../model/Posts/quries.js";
import {
  getAllPostComments,
  getReplies,
} from "../../../model/PostComments/quiries.js";

import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { checkIfAlreadyBookmarked } from "../../../model/Bookmark/quries.js";

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
  let commentsArr = [];
  let commentTree = [];
  // console.log("userId getIndiviualPostController ====> ",userId)
  // console.log("postId getIndiviualPostController ====> ",postId)

  const postResult = await getPost({ postId });
  // console.log("postResult from getIndiviualPostController ==>  ",postResult)
  const commentsResult = await getAllPostComments({ postId });

  const isLikedByUser = await isPostLikedByUser({
    userId: currentUserId,
    postId,
  });

  if (commentsResult.length) {
    commentsArr = commentsResult.map((comment) => {
      return {
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        likes: comment.likes,
        userName: comment.users.first_name,
        userProfileImg: comment.users.profile_img_url,
        userId: comment.users.id,
        parentId: comment.parent_id,
      };
    });

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

    commentTree = await constructCommentTree(commentsArr);
    commentTree = commentTree.filter((comment) => comment.parentId == null);
  }

  // console.log("commentTree ===> ",commentTree)

  if (postResult) {
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

    if (isLikedByUser) {
      likedByUser = true;
    }

    const isBookmarked = await checkIfAlreadyBookmarked({
      userId: currentUserId,
      postId,
    });

    if (isBookmarked) {
      bookmarked = true;
    }

    return res.status(200).send({
      message: `post fetched.`,
      postData: { ...postData, likedByUser, bookmarked },
    });
  } else {
    return res.status(404).send({
      message: "Post not found !!",
    });
  }
});
