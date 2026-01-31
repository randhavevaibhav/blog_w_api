import sequelize from "../../db.js";
import { CommentAnalytics } from "../CommentAnalytics/CommentAnalytics.js";

import { CommentLikes } from "./CommentLikes.js";

export const createCommentLikeTransaction = async ({ userId, commentId }) => {
  const result = await sequelize.transaction(async (t) => {
    const createCommentLikeResult = await CommentLikes.create(
      {
        user_id: userId,
        comment_id: commentId,
        created_at: new Date(),
      },
      {
        transaction: t,
      },
    );
    const incCommentLikeResult = await CommentAnalytics.increment(
      "likes",
      {
        by: 1,
        where: {
          comment_id: commentId,
        },
      },
      {
        transaction: t,
      },
    );

    return {
      createCommentLikeResult,
      incCommentLikeResult,
    };
  });

  return result;
};

export const isCommentLikedByUser = async ({ userId, commentId }) => {
  // console.log(" userId, commentId isCommentLikedByUser ===> ", userId, commentId )
  const result = await CommentLikes.findOne({
    where: {
      user_id: userId,
      comment_id: commentId,
    },
  });
  return result;
};

export const removeCommentLike = async ({ userId, commentId }) => {
  const result = CommentLikes.destroy({
    where: {
      comment_id: commentId,
      user_id: userId,
    },
  });

  return result;
};

