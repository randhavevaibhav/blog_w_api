import { PostLikes } from "./PostLikes.js"

export const createPostLike  = async({userId,postId,createdAt})=>{

    const result = await PostLikes.create({
        user_id:userId,
        post_id:postId,
        created_at:createdAt
    })
return result;
}

export const isPostLikedByUser = async ({userId,postId})=>
{
   
    const result = await PostLikes.findOne({
        where:{
            user_id:userId,
        post_id:postId,
        }
       
    })
return result;
}

export const removeUserPostLike = async({userId,postId})=>{
    const result = PostLikes.destroy({
        where:{
            post_id:postId,
            user_id:userId
        }
    });

    return result;
}

export const removeAllPostLikes = async({postId})=>{
    const result = PostLikes.destroy({
        where:{
            post_id:postId,
        }
    });

    return result;
}