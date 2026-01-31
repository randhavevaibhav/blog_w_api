import { Posts } from "../associations.js";
import sequelize from "../../db.js";
import { POST_LIMIT, SEARCH_POST_LIMIT } from "../../utils/constants.js";
import { Op, QueryTypes } from "sequelize";
import { Users } from "../Users/Users.js";
import { PostAnalytics } from "../PostAnalytics/PostAnalytics.js";
import { Bookmarks } from "../Bookmark/Bookmark.js";
import { PostHashtags } from "../PostHashtags/PostHashtags.js";
import { Hashtags } from "../Hashtags/Hashtags.js";
import { getAllUserFollowers } from "../Users/quires.js";
import { PostComments } from "../PostComments/PostComments.js";
import { PostLikes } from "../PostLikes/PostLikes.js";

export const createPostTransaction = async ({
  userId,
  title,
  titleImgURL,
  content,
  tagList,
}) => {
  const result = await sequelize.transaction(async (t) => {
    const createPostResult = await Posts.create(
      {
        user_id: userId,
        title,
        title_img_url: titleImgURL,
        content,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        transaction: t,
      },
    );

    const postId = createPostResult.id;
    const postAnalyticsResult = await PostAnalytics.create(
      {
        post_id: postId,
        likes: 0,
        comments: 0,
      },
      {
        transaction: t,
      },
    );
    let createPostHashtagsResults = null;
    if (tagList) {
      if (tagList.length > 0) {
        const postHashtagList = tagList.map((hashtag) => {
          return {
            hashtag_id: hashtag.id,
            post_id: postId,
          };
        });

        createPostHashtagsResults = await PostHashtags.bulkCreate(
          postHashtagList,
          {
            transaction: t,
          },
        );
      }
    }

    return {
      createPostResult,
      postAnalyticsResult,
      createPostHashtagsResults,
    };
  });

  return result;
};

export const deletePostTransaction = async ({ postId, userId }) => {
  const result = await sequelize.transaction(async (t) => {
    const deletePostResult = await Posts.destroy({
      where: {
        id: postId,
        user_id: userId,
      },
      transaction: t,
    });

    const deletePostCommentsResult = await PostComments.destroy({
      where: {
        post_id: postId,
        user_id: userId,
      },
      transaction: t,
    });

    const deletePostAnalyticsResult = await PostAnalytics.destroy({
      where: {
        post_id: postId,
      },
      transaction: t,
    });

    const deletePostLikesResult = PostLikes.destroy({
      where: {
        post_id: postId,
        user_id: userId,
      },
      transaction: t,
    });

    const deletePostHashtagsResult = await PostHashtags.destroy({
      where: {
        post_id: postId,
      },
      transaction: t,
    });

    return {
      deletePostResult,
      deletePostCommentsResult,
      deletePostAnalyticsResult,
      deletePostLikesResult,
      deletePostHashtagsResult,
    };
  });

  return result;
};

export const updatePostTransaction = async ({
  title,
  content,
  titleImgURL,
  userId,
  postId,
  tagList,
}) => {
  const result = await sequelize.transaction(async (t) => {
    const updatePostResult = await Posts.update(
      {
        title,
        content,
        title_img_url: titleImgURL,
        updated_at: new Date(),
      },
      {
        where: {
          id: postId,
          user_id: userId,
        },
        transaction: t,
      },
    );

    if (tagList) {
      if (tagList.length === 0) {
        await PostHashtags.destroy({
          where: {
            post_id: postId,
          },
          transaction: t,
        });
      } else if (tagList.length > 0) {
        await PostHashtags.destroy({
          where: {
            post_id: postId,
          },
          transaction: t,
        }).then(async () => {
          const postHashtagList = tagList.map((hashtag) => {
            return {
              hashtag_id: hashtag.id,
              post_id: postId,
            };
          });

          await PostHashtags.bulkCreate(postHashtagList, {
            transaction: t,
          }).catch((error) => {
            return next(
              new AppError(`Error while updating post hashtags. ${error}`),
            );
          });
        });
      }
    }

    return {
      updatePostResult,
    };
  });

  return result;
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
          user_id: userId,
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

export const getAllSearchedPosts = async ({ query, offset, sort = "desc" }) => {
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
    limit: SEARCH_POST_LIMIT,
  });

  return result;
};

export const getUserRecentPost = async ({ userId }) => {
  const result = await Posts.findOne({
    attributes: [
      ["id", "postId"],
      ["user_id", "userId"],
      ["created_at", "createdAt"],
      ["title_img_url", "titleImgURL"],
      "title",
    ],
    where: {
      user_id: userId,
    },
    include: [
      {
        model: PostAnalytics,
        attributes: ["likes", "comments"],
        
      },
    ],
    order: [["created_at", "DESC"]],
    raw:true
  });

  return result;
};

export const getAllFollowingUsersPosts = async ({ userId, offset }) => {
  const followingUsers = await getAllUserFollowers({ userId });

  const followingUsersIds = followingUsers.map((user) => user.id);

  if (followingUsersIds.length <= 0) {
    return [];
  }

  const result = await sequelize.query(
    `
      SELECT
  	"posts"."id",
  	"posts"."user_id",
  	"posts"."title",
  	"posts"."content",
  	"posts"."created_at",
  	"posts"."updated_at",
  	"posts"."title_img_url",
  	"users"."id" AS "users.id",
    "users"."first_name" AS "users.first_name",
  	"users"."profile_img_url" AS "users.profile_img_url",
  	"post_analytics"."id" AS "post_analytics.id",
  	"post_analytics"."likes" AS "post_analytics.likes",
  	"post_analytics"."comments" AS "post_analytics.comments",
  	"bookmarks"."id" AS "bookmarks.id",
  	STRING_AGG("post_hashtags->hashtags"."color"::TEXT, ', ') AS "post_hashtags.hashtags.color",
  	STRING_AGG("post_hashtags->hashtags"."name"::TEXT, ', ') AS "post_hashtags.hashtags.name",
    STRING_AGG("post_hashtags->hashtags"."id"::TEXT, ', ') AS "post_hashtags.hashtags.id"
  FROM
  	"posts" AS "posts"
  	LEFT OUTER JOIN "users" AS "users" ON "posts"."user_id" = "users"."id"
  	LEFT OUTER JOIN "post_analytics" AS "post_analytics" ON "posts"."id" = "post_analytics"."post_id"
  	LEFT OUTER JOIN "bookmarks" AS "bookmarks" ON "posts"."id" = "bookmarks"."post_id"
  	AND "bookmarks"."user_id" =:userId
  	LEFT OUTER JOIN "post_hashtags" AS "post_hashtags" ON "posts"."id" = "post_hashtags"."post_id"
  	LEFT OUTER JOIN "hashtags" AS "post_hashtags->hashtags" ON "post_hashtags"."hashtag_id" = "post_hashtags->hashtags"."id"
  WHERE
  	"posts"."user_id" IN (${followingUsersIds})
  GROUP BY
  	"posts"."id",
  	"posts"."user_id",
  	"posts"."title",
  	"posts"."content",
  	"posts"."created_at",
  	"posts"."updated_at",
  	"posts"."title_img_url",
  	"users"."id",
    "users.first_name",
  	"users"."profile_img_url",
  	"post_analytics"."id",
  	"post_analytics"."likes",
  	"post_analytics"."comments",
  	"bookmarks"."id"
  ORDER BY
  	"posts"."id"
  OFFSET :offset;
      `,
    {
      replacements: {
        userId,
        offset,
      },
      type: QueryTypes.SELECT,
    },
  );

  return result;
};

export const getAllTaggedPosts = async ({ hashtagId, offset }) => {
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
              id: hashtagId,
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
    asc: ["updated_at", "asc"],
    desc: ["updated_at", "desc"],
    name: ["title", "asc"],
  };
  const orderBy = sortByOptions[sortBy];

  const result = await Posts.findAll({
    // logging: console.log,
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
    limit: POST_LIMIT,
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
    order: [[{ model: Bookmarks }, "created_at", sort]],
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
    },
  );
  return result ? result[0].total_likes : null;
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
