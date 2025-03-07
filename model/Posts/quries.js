import { Posts } from "./Posts.js";
import { Users } from "../Users/users.js";
import sequelize from "../../db.js";

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

export const getAllPosts = async (offset) => {
  const result = await Posts.findAll({
    attributes: [
      "id",
      "user_id",
      "title",
      "created_at",
      "likes",
      "title_img_url",
    ],
    // limit:5,
    offset: offset,
    include: [
      {
        model: Users,
        attributes: ["first_name"],
      },
    ],
  });

  return result;
};
export const getAllOwnPosts = async (userId) => {
  const result = await sequelize.query(`SELECT 
    u.id as user_id, 
	u.first_name,
    p.id as post_id,
	p.created_at,
	p.title,
	p.likes,
	p.title_img_url,
    COUNT(pc.id) AS total_post_comments
FROM users u
JOIN posts p ON u.id = p.user_id
LEFT JOIN post_comments pc ON p.id = pc.post_id
WHERE u.id=${userId}
GROUP BY u.id, p.id,u.first_name,p.created_at,p.title,
	p.likes,
	p.title_img_url
ORDER BY u.id, p.id;`);
  return result;
};

export const getPost = async (userId, postId) => {
  const result = await Posts.findOne({
    attributes: [
      "id",
      "title",
      "content",
      "created_at",
      "likes",
      "title_img_url",
    ],
    include: [
      {
        model: Users,
        attributes: ["first_name"],
      },
    ],
    where: {
      user_id: userId,
      id: postId,
    },
  });

  return result;
};
export const deletePost = async (postId) => {
  const result = await Posts.destroy({
    where: {
      id: postId,
    },
  });

  return result;
};

export const updatePost = async (
  postId,
  title,
  content,
  titleImgURL,
  updatedAt
) => {
  const result = await Posts.update(
    {
      title,
      content,
      title_img_url: titleImgURL,
      updated_at: updatedAt,
    },
    {
      where: {
        id: postId,
      },
    }
  );

  return result;
};
