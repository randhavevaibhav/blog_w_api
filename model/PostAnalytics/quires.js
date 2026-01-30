import { PostAnalytics } from "./PostAnalytics.js";


export const getPostAnalytics = async ({ postId }) => {
  const result = await PostAnalytics.findOne({
    attributes: ["likes", "comments"],
    where: {
      post_id: postId,
    },
  });

  return result;
};
