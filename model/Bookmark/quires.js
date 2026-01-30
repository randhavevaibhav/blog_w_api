import { Bookmarks } from "./Bookmark.js";



export const createBookmark = async ({ userId, postId }) => {
  const result = await Bookmarks.create({
    user_id: userId,
    post_id: postId,
    created_at: new Date(),
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



