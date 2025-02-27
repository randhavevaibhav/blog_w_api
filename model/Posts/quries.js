import { Posts } from "./Posts.js";
import { Users } from "../Users/users.js";

export const createPost = async (
  userId,
  title,
  titleImgURL,
  content,
  createdAt,
  updatedAt,
  likes
) => {
  // console.log("{userId,title,titleImgURL,content,createdAt,updatedAt,likes}", {
  //   userId,
  //   title,
  //   titleImgURL,
  //   content,
  //   createdAt,
  //   updatedAt,
  //   likes,
  // });

  const result = await Posts.create({
    user_id: userId,
    title,
    title_img_url: titleImgURL,
    content,
    created_at: createdAt,
    updated_at: updatedAt,
    likes,
  });

  return result;
};

export const getAllPosts = async (userId) => {
  const result = await Posts.findAll({
    attributes: ["id", "title","title_img_url", "content", "created_at", "likes"],
    include: [
      {
        model: Users,
        attributes: ["id"],
      },
    ],
    where: {
      user_id: userId,
    },
  });

  return result;
};

export const getPost = async(userId,postId)=>{
  const result = await Posts.findOne({
    attributes: ["id", "title", "content", "created_at", "likes","title_img_url"],
    include: [
      {
        model: Users,
        attributes: ["id"],
      },
    ],
    where: {
      user_id: userId,
      id:postId
    },
  });

  return result;
}
