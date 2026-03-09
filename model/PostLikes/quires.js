import { PostLikes } from "./PostLikes.js";

export const createPostLike = async ({ userId, postId }) => {
  const [like, created] = await PostLikes.findOrCreate({
    where: {
      user_id: userId,
      post_id: postId,
    },
    defaults: {
      user_id: userId,
      post_id: postId,
      created_at: new Date(),
    },
  });

  return created ? 1 : 0;
};

export const checkIfPostLikedByUser = async ({ userId, postId }) => {
  const result = await PostLikes.findOne({
    where: {
      user_id: userId,
      post_id: postId,
    },
  });
  return result;
};

export const removeUserPostLike = async ({ userId, postId }) => {
  const result = PostLikes.destroy({
    where: {
      post_id: postId,
      user_id: userId,
    },
  });

  return result;
};
