import { CommentLikes } from "./CommentLikes.js";

export const createCommentLike = async ({ userId, commentId, createdAt }) => {
  const result = await CommentLikes.create({
    user_id: userId,
    comment_id: commentId,
    created_at: createdAt,
  });
  return result;
};

export const isCommentLikedByUser = async ({ userId, commentId }) => {
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

export const removeAllCommentLikes = async ({ commentId }) => {
  const result = CommentLikes.destroy({
    where: {
      comment_id: commentId,
    },
  });

  return result;
};
