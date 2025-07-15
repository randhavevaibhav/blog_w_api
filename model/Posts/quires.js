import { Posts } from "./Posts.js";
import sequelize from "../../db.js";
import { POST_LIMIT, SEARCH_POST_LIMIT } from "../../utils/constants.js";
import { QueryTypes } from "sequelize";

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
  const result = await sequelize.query( `
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
        offset
      },
      type: QueryTypes.SELECT,
    }
  );

  return result;
};

export const getAllTaggedPosts = async ({hashtagId,offset})=>{
  const result = await sequelize.query(`select 
ph.post_id,
ph.hashtag_id,
p.user_id,
u.first_name,
u.profile_img_url,
p.title_img_url,
p.title,
p.created_at,
pa.likes,
pa.comments
from post_hashtags ph
join posts p on p.id=ph.post_id
join users u on u.id = p.user_id
join post_analytics pa on p.id = pa.post_id
where ph.hashtag_id=:hashtagId
offset :offset
limit ${POST_LIMIT}`,{
  replacements:{
    hashtagId,
    offset
  },
  type:QueryTypes.SELECT
})

return result

}

export const getAllUserPosts = async ({ userId, offset, sortBy = "desc" }) => {
  const sortByOptions = {
    asc: "p.created_at asc",
    desc: "p.created_at desc",
    name: "p.title asc",
  };
  const orderBy = sortByOptions[sortBy];

  const result = await sequelize.query(
    `SELECT 
    u.id as user_id, 
	u.first_name,
    p.id as post_id,
	p.created_at,
	p.title,
	p.title_img_url,
  pa.comments as total_post_comments,
  pa.likes
FROM users u
JOIN posts p ON u.id = p.user_id
LEFT JOIN post_comments pc ON p.id = pc.post_id
LEFT JOIN post_analytics pa ON p.id = pa.post_id
WHERE u.id=:userId
GROUP BY u.id, p.id,u.first_name,p.created_at,p.title,
	p.likes,
	p.title_img_url,
  p.content,
  pa.likes,
  pa.comments
ORDER BY ${orderBy}
limit ${POST_LIMIT}
offset :offset`,
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
  const result = await sequelize.query(
    `select 
p.id,
u.first_name,
u.profile_img_url,
u.location,
u.registered_at,
u.email,
p.title,
p.content,
p.created_at,
p.title_img_url,
pa.likes,
pa.comments
from posts p
join post_analytics pa on pa.post_id=p.id
join users u on u.id=p.user_id
where p.id=:postId`,
    {
      replacements: {
        postId,
      },
      type: QueryTypes.SELECT,
    }
  );

  return result[0];
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
