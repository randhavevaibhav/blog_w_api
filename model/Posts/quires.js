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
      }
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
      }
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
          }
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
      }
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
              new AppError(`Error while updating post hashtags. ${error}`)
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

export const getAllPosts = async ({ offset, userId = null }) => {
  const result = await sequelize.query(
    `
    SELECT
    p.id AS "postId",
    (:offset / :limit) AS "page",
    p.user_id AS "userId",
    p.title,
    p.title_img_url AS "titleImgURL",
    pa.likes AS "likes",
    pa.comments AS "totalComments",
    p.created_at AS "createdAt",
    u.first_name AS "firstName",
    u.profile_img_url AS "profileImgURL",
    jsonb_agg(
        DISTINCT jsonb_build_object('id', h.id, 'color', h.color, 'name', h.name)
    ) FILTER (
        WHERE
            h.id IS NOT NULL
    ) AS hashtags,
    EXISTS (
        SELECT
            1
        FROM
            bookmarks b
        WHERE
            b.post_id = p.id
            AND b.user_id =:userId
    ) AS "isBookmarked",
    recent_comments.data AS "recentComments"
FROM
    posts p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN post_hashtags ph ON p.id = ph.post_id
    LEFT JOIN post_analytics pa ON p.id = pa.post_id
    LEFT JOIN hashtags h ON ph.hashtag_id = h.id
    LEFT JOIN LATERAL (
        SELECT
            jsonb_agg(c_sub) AS data
        FROM
            (
                SELECT
                    jsonb_build_object(
                        'id',
                        c.id,
                        'content',
                        c.content,
                        'createdAt',
                        c.created_at,
                        'user',
                        jsonb_build_object(
                            'userId',
                            cu.id,
                            'firstName',
                            cu.first_name,
                            'profileImgUrl',
                            cu.profile_img_url
                        )
                    ) AS c_sub
                FROM
                    post_comments c
                    JOIN users cu ON c.user_id = cu.id
                WHERE
                    c.post_id = p.id
                    and c.parent_id is null
                    AND c.content <> 'NA-#GOHST'
                ORDER BY
                    c.created_at DESC
                LIMIT
                    2
            ) sub
    ) recent_comments ON true
WHERE
    p.id IS NOT NULL
    AND u.id IS NOT NULL
GROUP BY
    p.id,
    p.user_id,
    p.title,
    p.title_img_url,
    pa.likes,
    pa.comments,
    p.created_at,
    u.first_name,
    u.profile_img_url,
    recent_comments.data
ORDER BY p.created_at DESC
OFFSET :offset
LIMIT :limit    
    `,
    {
      type: QueryTypes.SELECT,
      replacements: {
        userId,
        offset,
        limit: POST_LIMIT,
      },
    }
  );

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
    raw: true,
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
    p.id AS "postId",
    (:offset / :limit) AS "page",
    p.user_id AS "userId",
    p.title,
    p.title_img_url AS "titleImgURL",
    pa.likes AS "likes",
    pa.comments AS "totalComments",
    p.created_at AS "createdAt",
    u.first_name AS "firstName",
    u.profile_img_url AS "profileImgURL",
    jsonb_agg(
        DISTINCT jsonb_build_object('id', h.id, 'color', h.color, 'name', h.name)
    ) FILTER (
        WHERE
            h.id IS NOT NULL
    ) AS hashtags,
    EXISTS (
        SELECT
            1
        FROM
            bookmarks b
        WHERE
            b.post_id = p.id
            AND b.user_id =:userId
    ) AS "isBookmarked",
    recent_comments.data AS "recentComments"
FROM
    posts p
    INNER JOIN followers f ON p.user_id = f.user_id AND f.follower_id = :userId
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN post_hashtags ph ON p.id = ph.post_id
    LEFT JOIN post_analytics pa ON p.id = pa.post_id
    LEFT JOIN hashtags h ON ph.hashtag_id = h.id
    LEFT JOIN LATERAL (
        SELECT
            jsonb_agg(c_sub) AS data
        FROM
            (
                SELECT
                    jsonb_build_object(
                        'id',
                        c.id,
                        'content',
                        c.content,
                        'createdAt',
                        c.created_at,
                        'user',
                        jsonb_build_object(
                            'userId',
                            cu.id,
                            'firstName',
                            cu.first_name,
                            'profileImgUrl',
                            cu.profile_img_url
                        )
                    ) AS c_sub
                FROM
                    post_comments c
                    JOIN users cu ON c.user_id = cu.id
                WHERE
                    c.post_id = p.id
                    and c.parent_id is null
                    AND c.content <> 'NA-#GOHST'
                ORDER BY
                    c.created_at DESC
                LIMIT
                    2
            ) sub
    ) recent_comments ON true
WHERE
    p.id IS NOT NULL
    AND u.id IS NOT NULL
GROUP BY
    p.id,
    p.user_id,
    p.title,
    p.title_img_url,
    pa.likes,
    pa.comments,
    p.created_at,
    u.first_name,
    u.profile_img_url,
    recent_comments.data
OFFSET :offset
LIMIT :limit`,
    {
      type: QueryTypes.SELECT,
      replacements: {
        userId,
        offset,
        limit: POST_LIMIT,
      },
    }
  );
  return result;
};

export const getAllTaggedPosts = async ({ hashtagId, offset }) => {
  const result = await sequelize.query(
    `
    SELECT
    p.id AS "postId",
    (:offset / :limit) AS "page",
    p.user_id AS "userId",
    p.title,
    p.title_img_url AS "titleImgURL",
    pa.likes AS "likes",
    pa.comments AS "totalComments",
    p.created_at AS "createdAt",
    u.first_name AS "firstName",
    u.profile_img_url AS "profileImgURL",
    jsonb_agg(
        DISTINCT jsonb_build_object('id', h.id, 'color', h.color, 'name', h.name)
    ) FILTER (
        WHERE
            h.id IS NOT NULL
    ) AS hashtags
FROM
    posts p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN post_hashtags ph ON p.id = ph.post_id
    LEFT JOIN post_analytics pa ON p.id = pa.post_id
    LEFT JOIN hashtags h ON ph.hashtag_id = h.id
   
WHERE
    p.id IS NOT NULL
    AND u.id IS NOT NULL
    AND EXISTS (
        SELECT 1 
        FROM post_hashtags ph2 
        WHERE ph2.post_id = p.id 
        AND ph2.hashtag_id = :hashtagId
    )
GROUP BY
    p.id,
    p.user_id,
    p.title,
    p.title_img_url,
    pa.likes,
    pa.comments,
    p.created_at,
    u.first_name,
    u.profile_img_url
OFFSET :offset
LIMIT :limit
    
    `,
    {
      type: QueryTypes.SELECT,
      replacements: {
        hashtagId,
        offset,
        limit: POST_LIMIT,
      },
    }
  );

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
    attributes: [
      ["id", "postId"],
      ["created_at", "createdAt"],
      ["title_img_url", "imgURL"],
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
    offset,
    order: [orderBy, ["id", "desc"]],
    limit: POST_LIMIT,
    raw: true,
    nest: true,
  });
  return result;
};

export const getAllUserBookmarkedPosts = async ({
  userId,
  sort = "desc",
  hashtagId,
}) => {
  const filterByHashtag = !!hashtagId && Number(hashtagId) > 0;
  const safeSort = sort === "asc" ? "ASC" : "DESC";
  const result = await sequelize.query(
    `
  select
    p.id AS "postId",
    p.title,
    p.content,
    p.created_at AS "createdAt",
    p.title_img_url AS "titleImgURL",
    pa.likes,
    pa.comments,
    u.id AS "userId",
    u.first_name AS "firstName",
    u.profile_img_url AS "profileImgURL",
    jsonb_agg(
        DISTINCT jsonb_build_object('id', h.id, 'color', h.color, 'name', h.name)
    ) FILTER (
        WHERE
            h.id IS NOT NULL
    ) AS hashtags
from
    posts p
    left join users u ON p.user_id = u.id
    left join bookmarks b on p.id = b.post_id
    left join post_hashtags ph on p.id = ph.post_id
    left join post_analytics pa on p.id = pa.post_id
    left join hashtags h on ph.hashtag_id = h.id
where
    b.user_id =:userId
    ${
      filterByHashtag
        ? ` and exists (
        select
            1
        from
            post_hashtags ph2
        where
            ph2.post_id = p.id
            and ph2.hashtag_id =:hashtagId
    )`
        : ``
    }
group by
    p.id,
    p.title,
    p.content,
    p.created_at,
    p.title_img_url,
    pa.likes,
    pa.comments,
    u.first_name,
    b.created_at,
    u.profile_img_url,
    u.id
order by
    b.created_at ${safeSort}
    
    `,
    {
      replacements: {
        userId,
        hashtagId,
      },
      type: QueryTypes.SELECT,
    }
  );
  return result;
};

export const getAllBookmarkedPostsHashtags = async ({ userId }) => {
  const result = await sequelize.query(
    `
  select distinct
    (h.id),
    h.name,
    h.color
from
    bookmarks b
    left join post_hashtags ph on ph.post_id = b.post_id
    left join hashtags h on h.id = ph.hashtag_id
where
    b.user_id =:userId
    and h.id is not null`,
    {
      replacements: {
        userId,
      },
      type: QueryTypes.SELECT,
    }
  );

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
  return result ? result[0].total_likes : null;
};

export const getPost = async ({ postId }) => {
  const result = await Posts.findOne({
    where: {
      id: postId,
    },
  });

  return result;
};

export const getIndividualPost = async ({ postId, currentUserId }) => {
  const result = await sequelize.query(
    `
  SELECT
    p.id AS "postId",
    p.user_id AS "userId",
    p.title,
    p.title_img_url AS "titleImgURL",
    p.content,
    pa.likes AS "likes",
    pa.comments AS "totalComments",
    p.created_at AS "createdAt",
    u.first_name AS "firstName",
    u.profile_img_url AS "profileImgURL",
     EXISTS (
        SELECT
            1
        FROM
            bookmarks b
        WHERE
            b.post_id = p.id
            AND b.user_id =:currentUserId
    ) AS "isBookmarked",
    EXISTS (
        SELECT 
            1 
        FROM 
            post_likes pl
        WHERE 
            pl.user_id =:currentUserId
            AND pl.post_id=p.id
    ) AS "isLikedByUser",
    jsonb_agg(
        DISTINCT jsonb_build_object('id', h.id, 'color', h.color, 'name', h.name)
    ) FILTER (
        WHERE
            h.id IS NOT NULL
    ) AS hashtags
FROM
    posts p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN post_hashtags ph ON p.id = ph.post_id
    LEFT JOIN post_analytics pa ON p.id = pa.post_id
    LEFT JOIN hashtags h ON ph.hashtag_id = h.id
   
WHERE
    p.id IS NOT NULL
    AND u.id IS NOT NULL
    AND p.id=:postId

GROUP BY
    p.id,
    p.user_id,
    p.title,
    p.content,
    p.title_img_url,
    pa.likes,
    pa.comments,
    p.created_at,
    u.first_name,
    u.profile_img_url`,
    {
      type: QueryTypes.SELECT,
      replacements: {
        postId,
        currentUserId,
      },
    }
  );
  return result[0];
};

export const getTopRatedPosts = async ({ limit = 2, target = "likes" }) => {
  const result = await sequelize.query(
    `
  SELECT
    p.id AS "postId",
    p.user_id AS "userId",
    p.title,
    p.title_img_url AS "titleImgURL",
    pa.likes AS "likes",
    pa.comments AS "totalComments",
    p.created_at AS "createdAt",
    u.first_name AS "firstName",
    u.profile_img_url AS "profileImgURL",
    jsonb_agg(
        DISTINCT jsonb_build_object('id', h.id, 'color', h.color, 'name', h.name)
    ) FILTER (
        WHERE
            h.id IS NOT NULL
    ) AS hashtags
FROM
    posts p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN post_hashtags ph ON p.id = ph.post_id
    LEFT JOIN post_analytics pa ON p.id = pa.post_id
    LEFT JOIN hashtags h ON ph.hashtag_id = h.id
   
WHERE
    p.id IS NOT NULL
    AND u.id IS NOT NULL
    AND pa.${target}>0

GROUP BY
    p.id,
    p.user_id,
    p.title,
    p.title_img_url,
    pa.likes,
    pa.comments,
    p.created_at,
    u.first_name,
    u.profile_img_url
    
  ORDER BY pa.${target} DESC
  LIMIT :limit`,
    {
      type: QueryTypes.SELECT,
      replacements: {
        limit,
      },
    }
  );
  return result;
};
