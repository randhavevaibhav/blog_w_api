import { Posts } from "./Posts.js";
import sequelize from "../../db.js";
import { POST_LIMIT } from "../../utils/constants.js";

export const createPost = async ({
  userId,
  title,
  titleImgURL,
  content,
  createdAt,
  updatedAt,
  likes,
}) => {
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

export const getAllPosts = async ({ offset }) => {
  const result = await sequelize.query(`select
p.id as post_id,
u.id as user_id,
u.first_name,
u.profile_img_url,
p.title , 
p.created_at,
p.title_img_url,
pa.likes,
pa.comments as total_comments
from posts p
join post_analytics pa on pa.post_id=p.id
join users u on u.id = p.user_id
order by p.created_at desc,
p.id desc
offset ${offset}
limit ${POST_LIMIT}
`);

  return result[0];
};
export const getAllOwnPosts = async ({ userId }) => {
  const result = await sequelize.query(`SELECT 
    u.id as user_id, 
	u.first_name,
    p.id as post_id,
	p.created_at,
	p.title,
  p.content,
	pa.likes,
	p.title_img_url,
    COUNT(pc.id) AS total_post_comments
FROM users u
JOIN posts p ON u.id = p.user_id
LEFT JOIN post_comments pc ON p.id = pc.post_id
LEFT JOIN post_analytics pa ON p.id = pa.post_id
WHERE u.id=${userId}
GROUP BY u.id, p.id,u.first_name,p.created_at,p.title,
	p.likes,
	p.title_img_url,
  p.content,
  pa.likes
ORDER BY p.created_at desc;`);
  return result;
};

export const getTotalOwnPostsLikesCount = async ({ userId }) => {
  const result = await sequelize.query(`SELECT
  SUM(pa.likes) AS total_likes
FROM
  posts p
JOIN
  post_analytics pa ON p.id = pa.post_id
WHERE
  p.user_id=${userId};`);

  return result[0][0].total_likes ? result[0][0].total_likes : 0;
  
};

export const getPost = async ({ postId }) => {
  const result = await sequelize.query(`select 
p.id,
u.first_name,
u.profile_img_url,
p.title,
p.content,
p.created_at,
p.title_img_url,
pa.likes,
pa.comments
from posts p
join post_analytics pa on pa.post_id=p.id
join users u on u.id=p.user_id
where p.id=${postId}`);

  return result[0][0];
};
export const deletePost = async ({ postId }) => {
  const result = await Posts.destroy({
    where: {
      id: postId,
    },
  });

  return result;
};

export const updatePost = async ({
  postId,
  title,
  content,
  titleImgURL,
  updatedAt,
}) => {
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

