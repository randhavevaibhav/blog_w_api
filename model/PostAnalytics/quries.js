import { PostAnalytics } from "./PostAnalytics.js";


export const createPostAnalytics = async (postId) => {
  const result = await PostAnalytics.create({
    post_id: postId,
    likes: 0,
    comments:0
  });
  return result;
};

export const deletePostAnalytics = async (postId)=>{
  const result = await PostAnalytics.destroy({
    where:{
      post_id:postId
    }
  });
  return result;
}

export const getPostAnalytics = async (postId) => {
  const result = await PostAnalytics.findOne({
    attributes:["likes"],
    where: {
      post_id: postId,
    },
  });

  return result;
};









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


export const incCommentCount = async (postId)=>{
   
  const result = await PostAnalytics.increment("comments", {
    by: 1,
    where: {
      post_id: postId,
    },
  });

  return result;
}


export const decCommentCount = async (postId)=>{
   
  const result = await PostAnalytics.decrement("comments", {
    by: 1,
    where: {
      post_id: postId,
    },
  });

  return result;
}

export const isCommentCountZero = async(postId)=>{
  const result = await PostAnalytics.findOne( {
  attributes:["comments"],
    where: {
      post_id: postId,
    },
  });


  if(Number(result.comments)===0)
  {
    return true;
  }
  else{
    return false;
  }

}


