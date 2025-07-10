import { QueryTypes } from "sequelize";
import sequelize from "../../db.js";
import { Bookmarks } from "./Bookmark.js";

export const createBookmark = async ({ userId, postId, createdAt }) => {
  const result = await Bookmarks.create({
    user_id: userId,
    post_id: postId,
    created_at: createdAt,
  });

  return result;
};

export const removeBookmark = async ({ userId, postId }) => {
  const result = await Bookmarks.destroy({
    where: {
      user_id: userId,
      post_id: postId,
    },
  });

  return result;
};

export const checkIfAlreadyBookmarked = async ({ userId, postId }) => {
  const result = await Bookmarks.findOne({
    where: {
      user_id: userId,
      post_id: postId,
    },
  });

  return result;
};

export const getUserBookmarks = async ({ userId, sort }) => {
  const sortByOptions = {
    asc: "asc",
    desc: "desc",
  };
  const orderBy = sortByOptions[sort];
  const result = await sequelize.query(
    `select 
 b.user_id as user_id,
 p.user_id as author_id,
 u.first_name as author_name,
 p.id as post_id,
 p.title_img_url,
 p.title,
 p.created_at,
 u.profile_img_url
 from bookmarks b
 join posts p on p.id=b.post_id
 join users u on u.id= p.user_id 
 where b.user_id=:userId
 order by b.created_at ${orderBy}`,
    {
      replacements: { userId },

      type: QueryTypes.SELECT,
    }
  );
  return result;
};
