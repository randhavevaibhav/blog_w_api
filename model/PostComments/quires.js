import { PostComments } from "./PostComments.js";
import sequelize from "../../db.js";
import { COMMENT_LIMIT } from "../../utils/constants.js";
import { Op, QueryTypes } from "sequelize";

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
  const result = await sequelize.query(
    `select pc.id as comment_id,
pc.content,
pc.created_at,
ca.likes,
pc.parent_id,
pc.user_id,
u.first_name,
u.profile_img_url from post_comments pc 
join users u on u.id=pc.user_id
join comment_analytics ca on ca.comment_id=pc.id
where pc.post_id=:postId and pc.parent_id is null
order by ${sortBy.column} ${sortBy.type},pc.created_at desc
limit ${COMMENT_LIMIT}
offset :offset`,
    {
      replacements: {
        postId,
        offset,
      },
      type: QueryTypes.SELECT,
    }
  );

  return result;
};

export const getRecentComments = async ({ limit = 2, postId }) => {
  const result = await sequelize.query(
    `select pc.content,
pc.post_id,
pc.user_id,
pc.created_at,
u.first_name,
u.profile_img_url 
from post_comments pc
join users u on u.id=pc.user_id
where pc.post_id=:postId and pc.content!='NA-#GOHST' and pc.parent_id is null
order by pc.created_at desc
limit ${limit};`,
    {
      replacements: {
        postId,
      },
      type: QueryTypes.SELECT,
    }
  );

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

export const updateComment = async ({ commentId, content }) => {
  const result = await PostComments.update(
    { content },
    {
      where: {
        id: commentId,
      },
    }
  );

  return result;
};

export const isCommentBelongsToUser = async ({ userId, commentId }) => {
  const result = await PostComments.findOne({
    where: {
      id: commentId,
      user_id: userId,
    },
  });

  if (!result) {
    return false;
  } else {
    return true;
  }
};

export const getTotalOwnPostsCommentCount = async ({ userId }) => {
  const result = await sequelize.query(
    ` select SUM(pa.comments) AS total_comments
    FROM
      post_analytics pa
    JOIN
      posts p ON p.id = pa.post_id
    WHERE
      p.user_id=:userId`,
    {
      replacements: {
        userId,
      },
      type: QueryTypes.SELECT,
    }
  );

  return result ? result[0].total_comments : null;
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
  const result = await sequelize.query(
    `select pc.id as comment_id,
pc.content,
pc.created_at,
ca.likes,
pc.parent_id,
u.first_name,
u.id as user_id,
u.profile_img_url from post_comments pc 
join users u on u.id=pc.user_id
join comment_analytics ca on ca.comment_id=pc.id
where pc.parent_id=:commentId
order by created_at desc
`,
    {
      replacements: {
        commentId,
      },
      type: QueryTypes.SELECT,
    }
  );

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

export const deleteAllCmtReplies = async ({ commentId }) => {
  const result = await PostComments.destroy({
    where: {
      parent_id: commentId,
    },
  });

  return result;
};

export const getOwnRecentComment = async ({ userId }) => {

const result = await sequelize.query(`select 
pc.id,
pc.user_id,
pc.post_id,
pc.content,
pc.parent_id,
pc.created_at,
p.user_id as author_id
from post_comments pc
join posts p on p.id=pc.post_id 
where pc.user_id=:userId and pc.content <> 'NA-#GOHST' 
order by pc.created_at desc limit 1`,{
  replacements:{
    userId
  },
   type: QueryTypes.SELECT,
})

  return result[0];
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
