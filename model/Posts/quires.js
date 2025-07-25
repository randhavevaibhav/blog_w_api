import { Posts } from "./Posts.js";
import sequelize from "../../db.js";
import { POST_LIMIT, SEARCH_POST_LIMIT } from "../../utils/constants.js";
import { Op, QueryTypes } from "sequelize";
import { Users } from "../Users/Users.js";
import { PostAnalytics } from "../PostAnalytics/PostAnalytics.js";
import { Bookmarks } from "../Bookmark/Bookmark.js";
import { PostHashtags } from "../PostHashtags/PostHashtags.js";
import { Hashtags } from "../Hashtags/Hashtags.js";
import { getAllUserFollowers } from "../Users/quires.js";

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

export const getAllPosts = async ({ offset, userId }) => {
  const result = await Posts.findAll({
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
          ],
        },
      },
      {
        model: PostAnalytics,
        attributes: ["likes", "comments"],
      },
      {
        model: PostHashtags,
        include: [Hashtags],
      },
      {
        model: Bookmarks,
        attributes: ["id"],
        where: {
          user_id: userId ? userId : null,
        },
        required: false,
      },
    ],
    offset,
    order: [["created_at", "desc"]],
    limit: POST_LIMIT,
  });

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
    desc: ["created_at", "desc"],
    asc: ["created_at", "asc"],
  };

  const sortBy = sortOptions[sort];

  const result = await Posts.findAll({
    where: {
      title: {
        [Op.iLike]: `%${query}%`,
      },
    },
    include: [
      {
        model: Users,
        attributes: ["id", "first_name", "profile_img_url"],
        where: {
          id: {
            [Op.ne]: null,
          },
        },
      },
      {
        model: PostAnalytics,
        attributes: ["likes", "comments"],
      },
      {
        model: PostHashtags,
        include: [Hashtags],
      },
    ],
    offset,
    order: [sortBy],
    limit: postLimit,
  });

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
  const followingUsers = await getAllUserFollowers({ userId });

  const followingUsersIds = followingUsers.map((user) => user.id);

  if (followingUsersIds.length <= 0) {
    return [];
  }

  const result = await Posts.findAll({
    // logging:console.log,
    where: {
      user_id: followingUsersIds,
    },
    include: [
      {
        model: Users,
        attributes: ["id", "first_name", "profile_img_url"],
      },
      {
        model: PostAnalytics,
        attributes: ["likes", "comments"],
      },
      {
        model: Bookmarks,
        attributes: ["id"],
        where: {
          user_id: userId,
        },
        required: false,
      },
      {
        model: PostHashtags,
        include: [Hashtags],
      },
    ],
    offset,
  });

  return result;
};

export const getAllTaggedPosts = async ({ hashtagId, hashtagName, offset }) => {
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
    // logging: console.log,
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
