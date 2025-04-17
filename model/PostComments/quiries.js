import { Users } from "../Users/Users.js";
import { PostComments } from "./PostComments.js";
import sequelize from "../../db.js";

export const createPostComment = async ({
  userId,
  postId,
  content,
  createdAt,
}) => {
  const result = await PostComments.create({
    user_id: userId,
    post_id: postId,
    content,
    created_at: createdAt,
  });

  return result;
};

export const getAllPostComments = async ({ postId }) => {
  const result = await PostComments.findAll({
    attributes: ["id", "content", "created_at", "likes"],
    where: {
      post_id: postId,
    },
    include: [
      {
        model: Users,
        attributes: ["first_name", "id","profile_img_url"],
      },
    ],
  });

  return result;
};

export const getTotalOwnPostCommentsCount = async ({ userId }) => {
  const result = await sequelize.query(
    `select COUNT(pc.id) as total_comments_count from posts p 
join post_comments pc on pc.post_id=p.id
where p.user_id=${userId}; `
  );

  return result ? result[0][0].total_comments_count : null;
};

export const deletePostComments = async ({ postId }) => {
  const result = await PostComments.destroy({
    where: {
      post_id: postId,
    },
  });

  return result;
};

export const deleteSinglePostComment = async ({ userId, commentId }) => {
  const result = await PostComments.destroy({
    where: {
      id: commentId,
      user_id: userId,
    },
  });

  return result;
};

export const getOwnRecentComment = async ({ userId }) => {
  const result =
    sequelize.query(`select p.user_id, p.id as post_id,p.title as post_title,pc.content,pc.created_at  from post_comments pc
    join posts p on p.id = pc.post_id
    where pc.user_id =${userId}
    order by pc.created_at desc;`);

  return result;
};
