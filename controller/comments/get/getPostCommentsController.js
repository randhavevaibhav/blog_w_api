import { getCommentAnalytics } from "../../../model/CommentAnalytics/quires.js";
import { isCommentLikedByUser } from "../../../model/CommentLikes/quires.js";
import { getPostAnalytics } from "../../../model/PostAnalytics/quires.js";
import {
  getAllPostComments,
  getReplies,
} from "../../../model/PostComments/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { COMMENT_OFFSET } from "../../../utils/constants.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const getPostCommentsController = catchAsync(async (req, res, next) => {
  const { postId, currentUserId } = req.params;
  const { offset, sortby } = req.query;
  const formattedOffset = parseInt(offset);

  const sortOptionList = {
    asc: "asc",
    desc: "desc",
    likes: "likes",
  };

  const sortOption = sortOptionList[sortby];

  if (!isPositiveInteger(formattedOffset)) {
    return next(new AppError(`offset needs to be number`, 400));
  }

  if (!sortOption) {
    return next(
      new AppError(`please provide correct sort option. desc, asc, likes.`, 400)
    );
  }
  if (!postId) {
    return next(new AppError(`please send required field. postId`));
  }

  const commentsResult = await getAllPostComments({
    postId,
    offset,
    sort: sortby,
  });
  const commentsResultMapped = commentsResult.map((item) => item);
  // console.log("commentsResultMapped ==> ",commentsResultMapped)
  const postAnalytics = await getPostAnalytics({ postId });
  const totalComments = postAnalytics?.comments;

  const getComments = (commentArr) => {
    return commentArr.map(async (comment) => {
      let replies = [];
      let likedByUser = false;
      const commentLikes = await getCommentAnalytics({
        commentId: comment.comment_id,
      });

      if (currentUserId) {
        const isCmtLikedByUser = await isCommentLikedByUser({
          userId: currentUserId,
          commentId: comment.comment_id,
        });

        likedByUser = isCmtLikedByUser ? true : false;
      }

      const repliesResult = await getReplies({
        commentId: comment.comment_id,
      });
      if (repliesResult.length > 0) {
        return {
          commentId: comment.comment_id,
          content: comment.content,
          createdAt: comment.created_at,
          likes: commentLikes ? commentLikes.likes : 0,
          isCmtLikedByUser: likedByUser,
          userName: comment.first_name,
          userProfileImg: comment.profile_img_url,
          userId: comment.user_id,
          parentId: comment.parent_id,
          replies: await Promise.all(getComments(repliesResult)),
          page: parseInt(offset) / COMMENT_OFFSET,
        };
      } else {
        return {
          commentId: comment.comment_id,
          content: comment.content,
          createdAt: comment.created_at,
          likes: commentLikes ? commentLikes.likes : 0,
          isCmtLikedByUser: likedByUser,
          userName: comment.first_name,
          userProfileImg: comment.profile_img_url,
          userId: comment.user_id,
          parentId: comment.parent_id,
          replies,
          page: parseInt(offset) / COMMENT_OFFSET,
        };
      }
    });
  };

  if (commentsResultMapped.length > 0) {
    // console.log("commentsResultMapped ==> ",commentsResultMapped)
    Promise.all(getComments(commentsResultMapped, currentUserId))
      .then(async (comments) => {
        return res.status(200).send({
          message: `comments fetched.`,
          comments,
          totalComments: totalComments.comments,
          offset: Number(offset) + COMMENT_OFFSET,
        });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    return res.status(200).send({
      message: `No comments found.`,
      comments: [],
      totalComments: totalComments.comments,
      offset: Number(offset) + COMMENT_OFFSET,
    });
  }
});
