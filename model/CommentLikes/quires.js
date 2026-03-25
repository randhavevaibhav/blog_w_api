import { QueryTypes } from "sequelize";
import sequelize from "../../db.js";
import { CommentAnalytics } from "../CommentAnalytics/CommentAnalytics.js";
import { CommentLikes } from "./CommentLikes.js";

export const destroyCommentLikeTransaction = async ({ userId, commentId }) => {
  const result = await sequelize.transaction(async (t) => {
    const removeCommentLikeResult = await CommentLikes.destroy({
      where: {
        comment_id: commentId,
        user_id: userId,
      },
      transaction: t,
    });
    const decCommentLikeResult = await sequelize.query(
      `UPDATE comment_analytics
  SET likes = CASE
      WHEN likes > 0 THEN likes - 1
      ELSE 0
  END
  WHERE comment_id=:commentId`,
      {
        replacements: { commentId },
        type: QueryTypes.SELECT,
        transaction: t,
      },
    );
    return {
      removeCommentLikeResult,
      decCommentLikeResult,
    };
  });

  return result;
};

export const createCommentLikeTransaction = async ({ userId, commentId }) => {
  const result = await sequelize.transaction(async (t) => {
    const createCommentLikeResult = await CommentLikes.findOrCreate({
      where: {
        user_id: userId,
        comment_id: commentId,
      },
      defaults: {
        user_id: userId,
        comment_id: commentId,
        created_at: new Date(),
      },
      transaction:t
    });
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
