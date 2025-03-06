import { Users } from "../Users/users.js";
import { PostComments } from "./PostComments.js";

export const createPostComment = async (
  userId,
  postId,
  content,
  createdAt,
) => {
  const result = await PostComments.create({
    user_id:userId,
    post_id: postId,
    content,
    created_at:createdAt
  });

  return result;
};


export const getAllPostComments = async(postId)=>{
  const result = await PostComments.findAll({
    attributes: [
     "id",
      "content",
      "created_at",
      "likes",
    ],
    where:{
      post_id:postId
    },
     include: [
          {
            model: Users,
            attributes: ["first_name"],
          },
        ],
  });

  return result;
}

export const getAllOwnPostComments = async (userId)=>{
  const result = await PostComments.findAll({
    where:{
      user_id:userId
    }
  })

  return result;
}