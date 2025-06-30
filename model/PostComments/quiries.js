import { PostComments } from "./PostComments.js";
import sequelize from "../../db.js";
import { COMMENT_LIMIT } from "../../utils/constants.js";

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

export const getAllPostComments = async ({
  postId,
  offset = 0,
  sort = "desc",
}) => {
  const sortOptions = {
    desc: {
      column: "pc.created_at",
      type: "desc",
    },
    asc: {
      column: "pc.created_at",
      type: "asc",
    },
    likes: {
      column: "ca.likes",
      type: "desc",
    },
  };

  const sortBy = sortOptions[sort];
  const result = await sequelize.query(`select pc.id as comment_id,
pc.content,
pc.created_at,
ca.likes,
pc.parent_id,
pc.user_id,
u.first_name,
u.profile_img_url from post_comments pc 
join users u on u.id=pc.user_id
join comment_analytics ca on ca.comment_id=pc.id
where pc.post_id=${postId} and pc.parent_id is null
order by ${sortBy.column} ${sortBy.type},pc.created_at desc
limit ${COMMENT_LIMIT}
offset ${offset}`);
  if (result && result[1]) {
    return result[1].rows;
  }
};

export const getRecentComments = async ({ limit = 2, postId }) => {
  const result = await sequelize.query(`select pc.content,
pc.post_id,
pc.user_id,
pc.created_at,
u.first_name,
u.profile_img_url 
from post_comments pc
join users u on u.id=pc.user_id
where pc.post_id=${postId} and pc.content!='NA-#GOHST'
order by pc.created_at desc
limit ${limit};`);

  return result[0];
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
    `select sum(comments) as comments from posts p
    join post_analytics pa on p.id=pa.post_id
    where p.user_id=${userId}`
  );

  return result ? result[0][0].comments : null;
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
  const result = await sequelize.query(`select pc.id as comment_id,
pc.content,
pc.created_at,
ca.likes,
pc.parent_id,
u.first_name,
u.id as user_id,
u.profile_img_url from post_comments pc 
join users u on u.id=pc.user_id
join comment_analytics ca on ca.comment_id=pc.id
where pc.parent_id=${commentId}
order by created_at desc
`);

  if (result && result[1]) {
    return result[1].rows;
  }
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
    where pc.user_id =${userId} and pc.content!='NA-#GOHST'
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
