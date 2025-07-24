import { Posts } from "./Posts.js";
import sequelize from "../../db.js";
import { POST_LIMIT, SEARCH_POST_LIMIT } from "../../utils/constants.js";
import { Op, QueryTypes } from "sequelize";
import { Users } from "../Users/Users.js";
import { PostAnalytics } from "../PostAnalytics/PostAnalytics.js";
import { Bookmarks } from "../Bookmark/Bookmark.js";
import { PostHashtags } from "../PostHashtags/PostHashtags.js";
import { Hashtags } from "../Hashtags/Hashtags.js";

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

export const isPostBelongsToUser = async ({ userId, postId }) => {
  const result = await Posts.findOne({
    where: {
      id: postId,
      user_id: userId,
    },
  });

  if (!result) {
    return false;
  } else {
    return true;
  }
};

export const getAllPosts = async ({ offset }) => {
  const result = await sequelize.query(
    `select
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
offset :offset
limit ${POST_LIMIT}
`,
    {
      replacements: {
        offset,
      },
      type: QueryTypes.SELECT,
    }
  );

  return result;
};

export const getAllSearchedPosts = async ({
  query,
  offset,
  sort = "desc",
  limit,
}) => {
  const postLimit = limit ? limit : SEARCH_POST_LIMIT;
  const sortOptions = {
    desc: {
      column: "p.created_at",
      type: "desc",
    },
    asc: {
      column: "p.created_at",
      type: "asc",
    },
  };

  const sortBy = sortOptions[sort];
  const result = await sequelize.query(
    `select
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
where LOWER(p.title) like LOWER(:query)
order by ${sortBy.column} ${sortBy.type},p.created_at desc,
p.id desc
offset :offset
limit ${postLimit}
`,
    {
      replacements: {
        offset,
        query: `%${query}%`,
      },
      type: QueryTypes.SELECT,
    }
  );

  return result;
};

export const getUserRecentPost = async ({ userId }) => {
  const result = await Posts.findOne({
    where: {
      user_id: userId,
    },
    order: [["created_at", "DESC"]],
  });

  return result;
};

export const getAllFollowingUsersPosts = async ({ userId, offset }) => {
  const result = await sequelize.query(
    `
select 
p.id as post_id,
u.first_name,
u.profile_img_url,
p.title_img_url,
p.title,
p.created_at,
pa.likes as likes,
pa.comments as total_comments,
u.id as user_id
from posts p
join users u on u.id=p.user_id
join post_analytics pa on pa.post_id=p.id
where p.user_id in 
(select user_id from followers where follower_id=:userId)
offset :offset
limit ${POST_LIMIT}`,
    {
      replacements: {
        userId,
        offset,
      },
      type: QueryTypes.SELECT,
    }
  );

  return result;
};

export const getAllTaggedPosts = async ({ hashtagId,hashtagName, offset }) => {
  const result = await Posts.findAll({
    // logging: console.log,
    include: [
      {
        model: PostHashtags,
        where: {
          id: {
            [Op.ne]: null,
          },
        },
        include: [
          {
            model: Hashtags,
           
            where: {
              name: hashtagName,
            },
          },
        ],
      },
       {
        model: Users,
        attributes: ["id", "first_name", "profile_img_url"],
       },
        {
        model: PostAnalytics,
        attributes: ["likes", "comments"],
      },
    ],
 
    offset,
    order: [["created_at", "desc"]],
  });

  return result;
};


export const getAllUserPosts = async ({ userId, offset, sortBy = "desc" }) => {
  const sortByOptions = {
    asc: ["created_at", "asc"],
    desc: ["created_at", "desc"],
    name: ["title", "asc"],
  };
  const orderBy = sortByOptions[sortBy];

  const result = await Posts.findAll({
    where: {
      user_id: userId,
    },
    include: [
      {
        model: PostAnalytics,
        attributes: ["likes", "comments"],
      },
    ],
    offset,
    order: [orderBy, ["id", "desc"]],
  });
  return result;
};

export const getAllUserBookmarkedPosts = async ({ userId, sort = "desc" }) => {
  const result = await Posts.findAll({
    // logging:console.log,
    include: [
      {
        model: Users,
        attributes: ["id", "first_name", "profile_img_url"],
        where: {
          [Op.and]: [
            {
              id: {
                [Op.ne]: null,
              },
            },
            {
              id: userId,
            },
          ],
        },
      },
      {
        model: PostAnalytics,
        attributes: ["likes", "comments"],
      },
      {
        model: Bookmarks,
        where: {
          user_id: userId,
        },
      },
      {
        model: PostHashtags,
        include: [Hashtags],
      },
    ],
    order: [
      [{ model: Bookmarks }, "created_at", sort],
      ["id", "desc"],
    ],
  });
  return result;
};

export const getTotalOwnPostsLikesCount = async ({ userId }) => {
  const result = await sequelize.query(
    `SELECT
  SUM(pa.likes) AS total_likes
FROM
  posts p
JOIN
  post_analytics pa ON p.id = pa.post_id
WHERE
  p.user_id=:userId;`,
    {
      replacements: {
        userId,
      },
      type: QueryTypes.SELECT,
    }
  );
  return result[0].total_likes ? result[0].total_likes : 0;
};

export const getPost = async ({ postId }) => {
  const result = await Posts.findOne({
    where: {
      id: postId,
    },
    include: [
      {
        model: Users,
        attributes: ["first_name", "profile_img_url"],
      },
    ],
  });

  return result;
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
