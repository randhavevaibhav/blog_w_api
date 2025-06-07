import { Users } from "../Users/Users.js";
import { PostComments } from "./PostComments.js";
import sequelize from "../../db.js";

export const createPostComment = async ({
  userId,
  postId,
  content,
  createdAt,
  parentId,
}) => {
  const result = await PostComments.create({
    user_id: userId,
    post_id: postId,
    content,
    created_at: createdAt,
    parent_id: parentId,
  });

  return result;
};

export const getAllPostComments = async ({ postId }) => {
  const result = await PostComments.findAll({
    attributes: ["id", "content", "created_at", "likes", "parent_id"],
    where: {
      post_id: postId,
    },
    include: [
      {
        model: Users,
        attributes: ["first_name", "id", "profile_img_url"],
      },
    ],
  });

  return result;
};

export const updateCommentAsGhost = async ({ commentId }) => {
  const result = await PostComments.update(
    { content: "NA-#GOHST" },
    {
      where: {
        id: commentId,
      },
    }
  );

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

export const getReplies = async ({ commentId }) => {
  const res = await PostComments.findAll({
    where: {
      parent_id: commentId,
    },
    include: [
      {
        model: Users,
        attributes: ["first_name", "id", "profile_img_url"],
      },
    ],
  });

  return res;
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

export const deleteAllCmtReplies = async ({ commentId }) => {
  const result = await PostComments.destroy({
    where: {
      parent_id: commentId,
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

export const incPostCommentLike = async ({ commentId }) => {
  const res = await PostComments.increment("likes", {
    by: 1,
    where: {
      id: commentId,
    },
  });

  return res;
};

export const decPostCommentLike = async ({ commentId }) => {
  const res = await PostComments.decrement("likes", {
    by: 1,
    where: {
      id: commentId,
    },
  });

  return res;
};
