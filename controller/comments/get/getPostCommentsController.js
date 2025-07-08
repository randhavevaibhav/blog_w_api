import { getCommentAnalytics } from "../../../model/CommentAnalytics/quries.js";
import { isCommentLikedByUser } from "../../../model/CommentLikes/quries.js";
import { getCommentPostAnalytics } from "../../../model/PostAnalytics/quries.js";
import {
  getAllPostComments,
  getReplies,
} from "../../../model/PostComments/quiries.js";
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
    return next(new AppError(`please provide correct sort option. desc, asc, likes.`, 400));
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
  const totalComments = await getCommentPostAnalytics({ postId });

  const getComments = (commentArr) => {
    return commentArr.map(async (comment) => {
      let replies = [];
      let likedByuser = false;
      const commetLikes = await getCommentAnalytics({
        commentId: comment.comment_id,
      });

      if (currentUserId) {
        const isCmtLikedByUser = await isCommentLikedByUser({
          userId: currentUserId,
          commentId: comment.comment_id,
        });

        likedByuser = isCmtLikedByUser ? true : false;
      }

      const repliesResult = await getReplies({
        commentId: comment.comment_id,
      });
      if (repliesResult.length > 0) {
        return {
          commentId: comment.comment_id,
          content: comment.content,
          createdAt: comment.created_at,
          likes: commetLikes ? commetLikes.likes : 0,
          isCmtLikedByUser: likedByuser,
          userName: comment.first_name,
          userProfileImg: comment.profile_img_url,
          userId: comment.user_id,
          parentId: comment.parent_id,
          replies: await Promise.all(getComments(repliesResult)),
          page:parseInt(offset)/COMMENT_OFFSET,
        };
      } else {
        return {
          commentId: comment.comment_id,
          content: comment.content,
          createdAt: comment.created_at,
          likes: commetLikes ? commetLikes.likes : 0,
          isCmtLikedByUser: likedByuser,
          userName: comment.first_name,
          userProfileImg: comment.profile_img_url,
          userId: comment.user_id,
          parentId: comment.parent_id,
          replies,
          page:parseInt(offset)/COMMENT_OFFSET,
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
