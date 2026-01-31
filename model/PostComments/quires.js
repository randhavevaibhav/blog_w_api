import { PostComments } from "../associations.js";
import sequelize from "../../db.js";
import { COMMENT_LIMIT } from "../../utils/constants.js";
import { Op, QueryTypes } from "sequelize";
import { Users } from "../Users/Users.js";
import { CommentAnalytics } from "../CommentAnalytics/CommentAnalytics.js";

export const createPostCommentTransaction = async ({
  userId,
  postId,
  parentId,
  content,
}) => {

  const result = await sequelize.transaction(async (t) => {
    const comment = await PostComments.create(
      {
        user_id: userId,
        post_id: postId,
        content,
        created_at: new Date(),
        parent_id: parentId,
      },
      { transaction: t },
    );

    await CommentAnalytics.create(
      {
        comment_id: comment.id,
        likes: 0,
      },
      { transaction: t },
    );
    return comment;
  });

  return result;
};



export const getAllAuthUserPostComments = async ({
  postId,
  offset = 0,
  currentUserId,
  sort = "desc",
}) => {
  const sortOptions = {
    desc: {
      column: "ch.created_at",
      type: "desc",
    },
    asc: {
      column: "ch.created_at",
      type: "asc",
    },
    likes: {
      column: "likes",
      type: "desc",
    },
  };

  const sortBy = sortOptions[sort];

  const result = await sequelize.query(
    `WITH RECURSIVE CommentHierarchy AS (
    -- Anchor: ONLY the first 10 top-level comments
    SELECT 
        id, content, parent_id, user_id, created_at, post_id,
        id::TEXT as path,
        0 as depth
    FROM (
        SELECT * FROM post_comments 
        WHERE post_id = :postId AND parent_id IS NULL
        ORDER BY created_at DESC
        LIMIT :limit OFFSET :offset
    ) AS top_level

    UNION ALL

    -- Recursive: Find children for ONLY those 10 parents
    SELECT
        pc.id, pc.content, pc.parent_id, pc.user_id, pc.created_at, pc.post_id,
        (ch.path || ',' || pc.id)::TEXT,
        ch.depth + 1
    FROM post_comments pc
    INNER JOIN CommentHierarchy ch ON pc.parent_id = ch.id
)
SELECT
    ch.id AS "commentId",
    ch.content,
    ch.created_at AS "createdAt",
    ch.parent_id AS "parentId",
    ch.user_id AS "userId",
    ch.depth,
    COALESCE(ca.likes, 0) AS likes,
    CASE WHEN cl.user_id IS NOT NULL THEN 'true' ELSE 'false' END AS "isCmtLikedByUser",
    u.first_name AS "userName",
    u.profile_img_url AS "userProfileImg"
FROM CommentHierarchy ch
JOIN users u ON u.id = ch.user_id
LEFT JOIN comment_analytics ca ON ca.comment_id = ch.id
LEFT JOIN comment_likes cl ON cl.comment_id = ch.id AND cl.user_id = :currentUserId
ORDER BY ${sortBy.column} ${sortBy.type},ch.created_at desc,ch.depth desc`,
    {
      replacements: {
        postId,
        currentUserId,
        limit: COMMENT_LIMIT,
        offset: parseInt(offset),
      },
      type: QueryTypes.SELECT,
    },
  );
  return result;
};

export const getAllPostComments = async ({
  postId,
  offset = 0,
  sort = "desc",
}) => {
  const sortOptions = {
    desc: {
      column: "ch.created_at",
      type: "desc",
    },
    asc: {
      column: "ch.created_at",
      type: "asc",
    },
    likes: {
      column: "likes",
      type: "desc",
    },
  };

  const sortBy = sortOptions[sort];

  const result = await sequelize.query(
    `WITH RECURSIVE CommentHierarchy AS (
    -- Anchor: ONLY the first 10 top-level comments
    SELECT 
        id, content, parent_id, user_id, created_at, post_id,
        id::TEXT as path,
        0 as depth
    FROM (
        SELECT * FROM post_comments 
        WHERE post_id = :postId AND parent_id IS NULL
        ORDER BY created_at DESC
        LIMIT :limit OFFSET :offset
    ) AS top_level

    UNION ALL

    -- Recursive: Find children for ONLY those 10 parents
    SELECT
        pc.id, pc.content, pc.parent_id, pc.user_id, pc.created_at, pc.post_id,
        (ch.path || ',' || pc.id)::TEXT,
        ch.depth + 1
    FROM post_comments pc
    INNER JOIN CommentHierarchy ch ON pc.parent_id = ch.id
)
SELECT
    ch.id AS "commentId",
    ch.content,
    ch.created_at AS "createdAt",
    ch.parent_id AS "parentId",
    ch.user_id AS "userId",
    ch.depth,
    COALESCE(ca.likes, 0) AS likes,
    CASE WHEN cl.user_id IS NOT NULL THEN 'true' ELSE 'false' END AS "isCmtLikedByUser",
    u.first_name AS "userName",
    u.profile_img_url AS "userProfileImg"
FROM CommentHierarchy ch
JOIN users u ON u.id = ch.user_id
LEFT JOIN comment_analytics ca ON ca.comment_id = ch.id
LEFT JOIN comment_likes cl ON cl.comment_id = ch.id
ORDER BY ${sortBy.column} ${sortBy.type},ch.created_at desc,ch.depth desc`,
    {
      replacements: {
        postId,
        limit: COMMENT_LIMIT,
        offset: parseInt(offset),
      },
      type: QueryTypes.SELECT,
    },
  );
  return result;
};

export const getRecentComments = async ({ limit = 2, postId }) => {
  const result = await PostComments.findAll({
    // logging:console.log,
    where: {
      [Op.and]: [
        {
          post_id: postId,
        },
        {
          content: {
            [Op.ne]: "NA-#GOHST",
          },
        },
        {
          parent_id: {
            [Op.eq]: null,
          },
        },
      ],
    },
    include: [
      {
        model: Users,
        attributes: ["id", "first_name", "profile_img_url"],
      },
    ],
    order: [["created_at", "desc"]],
    limit,
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
    },
  );

  return result;
};

export const updateComment = async ({ commentId, content,userId }) => {
  const result = await PostComments.update(
    { content },
    {
      where: {
        id: commentId,
        user_id:userId
      },
    },
  );

  return result;
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
    },
  );

  return result ? result[0].total_comments : null;
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
  const result = await sequelize.query(
    `select 
pc.id AS "commentId",
pc.user_id AS "userId",
pc.post_id AS "postId",
pc.content,
pc.parent_id AS "parentId", 
pc.created_at AS "createdAt",
p.user_id  AS "authorId"
from post_comments pc
join posts p on p.id=pc.post_id 
where pc.user_id=:userId and pc.content <> 'NA-#GOHST' 
order by pc.created_at desc limit 1`,
    {
      replacements: {
        userId,
      },
      type: QueryTypes.SELECT,
    },
  );

  return result[0];
};


