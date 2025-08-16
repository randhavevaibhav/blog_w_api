import { PostAnalytics } from "./PostAnalytics.js";

export const createPostAnalytics = async ({ postId }) => {
  const result = await PostAnalytics.create({
    post_id: postId,
    likes: 0,
    comments: 0,
  });
  return result;
};

export const deletePostAnalytics = async ({ postId }) => {
  const result = await PostAnalytics.destroy({
    where: {
      post_id: postId,
    },
  });
  return result;
};

export const getPostAnalytics = async ({ postId }) => {
  const result = await PostAnalytics.findOne({
    attributes: ["likes", "comments"],
    where: {
      post_id: postId,
    },
  });

  return result;
};
