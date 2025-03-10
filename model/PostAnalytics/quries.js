import { PostAnalytics } from "./PostAnalytics.js";

export const incPostLike = async ( postId ) => {

    
  const result = await PostAnalytics.increment("likes", {
    by: 1,
    where: {
      post_id: postId,
    },
  });

  return result;
};


export const decPostLike = async ( postId ) => {

    
    const result = await PostAnalytics.decrement("likes", {
      by: 1,
      where: {
        post_id: postId,
      },
    });
  
    return result;
  };
  

export const createPostAnalytics = async (postId) => {
  const result = await PostAnalytics.create({
    post_id: postId,
    likes: 0,
  });
  return result;
};

export const getPostAnalytics = async (postId) => {
  const result = await PostAnalytics.findOne({
    where: {
      post_id: postId,
    },
  });

  return result;
};
