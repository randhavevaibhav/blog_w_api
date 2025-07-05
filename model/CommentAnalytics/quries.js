import sequelize from "../../db.js";
import { CommentAnalytics } from "./CommentAnalytics.js";

export const createCommentAnalytics = async ({ commentId }) => {
  const result = await CommentAnalytics.create({
    comment_id: commentId,
    likes: 0,
  });
  return result;
};

export const deleteCommentAnalytics = async ({ commentId }) => {
  const result = await CommentAnalytics.destroy({
    where: {
      comment_id: commentId,
    },
  });
  return result;
};

export const getCommentAnalytics = async ({ commentId }) => {
  const result = await CommentAnalytics.findOne({
    attributes: ["likes"],
    where: {
      comment_id: commentId,
    },
  });

  return result;
};

export const incCommentLike = async ({ commentId }) => {
  const result = await CommentAnalytics.increment("likes", {
    by: 1,
    where: {
      comment_id: commentId,
    },
  });

  return result;
};

export const decCommentLike = async ({ commentId }) => {
  const result = await sequelize.query(`UPDATE comment_analytics
  SET likes = CASE
      WHEN likes > 0 THEN likes - 1
      ELSE 0
  END
  WHERE comment_id = ${commentId};`);

  return result;
};
