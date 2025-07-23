import { Op } from "sequelize";
import { Bookmarks } from "./Bookmark.js";
import { Posts } from "../Posts/Posts.js";


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


export const getUserBookmarks = async ({userId,sort='desc'}) => {

  const result = await Bookmarks.findAll({
    // logging:console.log,
    where:{
      user_id:userId
    },
    include:[{
      model:Posts,
      attributes:["id","user_id","title","title_img_url","created_at"],
      where:{
        id:{
          [Op.ne]:null
        },
        
      },
    
    }],
     order:[ ["created_at",sort],['id', sort]],
  })
  return result;
};
