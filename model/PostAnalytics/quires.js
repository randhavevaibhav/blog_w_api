import { QueryTypes } from "sequelize";
import sequelize from "../../db.js";
import { PostAnalytics } from "./PostAnalytics.js";

export const createPostAnalytics = async ({ postId }) => {
  const result = await PostAnalytics.create({
    post_id: postId,
    likes: 0,
    comments: 0,
  });
  return result;
};

export const deletePostAnalytics = async ({ postId }) => {
  const result = await PostAnalytics.destroy({
    where: {
      post_id: postId,
    },
  });
  return result;
};

export const getPostAnalytics = async ({ postId }) => {
  const result = await PostAnalytics.findOne({
    attributes: ["likes", "comments"],
    where: {
      post_id: postId,
    },
  });

  return result;
};

export const incPostLike = async (postId) => {
  const result = await PostAnalytics.increment("likes", {
    by: 1,
    where: {
      post_id: postId,
    },
  });

  return result;
};

export const decPostLike = async (postId) => {
  const result = await sequelize.query(
    `UPDATE post_analytics
  SET likes = CASE
      WHEN likes > 0 THEN likes - 1
      ELSE 0
  END
  WHERE post_id=:postId`,
    {
      replacements: {
        postId,
      },
      type: QueryTypes.SELECT,
    }
  );

  return result;
};

export const incCommentCount = async (postId) => {
  const result = await PostAnalytics.increment("comments", {
    by: 1,
    where: {
      post_id: postId,
    },
  });

  return result;
};

export const decCommentCount = async (postId) => {
  const result = await sequelize.query(
    `UPDATE post_analytics
  SET comments = CASE
      WHEN comments > 0 THEN comments - 1
      ELSE 0
  END
  WHERE post_id=:postId`,
    {
      replacements: {
        postId,
      },
      type: QueryTypes.SELECT,
    }
  );

  return result;
};
