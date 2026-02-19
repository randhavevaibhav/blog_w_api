import { QueryTypes } from "sequelize";
import sequelize from "../../db.js";
import { Users } from "../associations.js";
import { Followers } from "../Followers/Followers.js";


export const createUser = async ({
  firstName,
  email,
  encryptedPassword,
  registered_at,
  profileImgUrl,
}) => {
  const result = await Users.create({
    first_name: firstName,
    email,
    password_hash: encryptedPassword,
    registered_at,
    profile_img_url: profileImgUrl,
    posts: 0,
    comments: 0,
  });

  return result;
};

export const getUserWithEmail = async ({ email }) => {
  const user = await Users.findOne({ where: { email: email } });

  return user;
};

export const getUserWithId = async ({ userId }) => {
  const user = await Users.findOne({ where: { id: userId } });
  return user;
};

export const checkIfUserExistWithMail = async ({ email }) => {
  const result = await sequelize.query(
    `SELECT 1 FROM users WHERE email=:email LIMIT 1`,
    {
      replacements: { email },
      type: QueryTypes.SELECT,
    }
  );
  if (result.length > 0) {
    return true;
  } else {
    return false;
  }
};

export const checkIfUserExistWithId = async ({ userId }) => {
  const result = await sequelize.query(
    `SELECT 1 FROM users WHERE id=:userId LIMIT 1`,
    {
      replacements: { userId },
      type: QueryTypes.SELECT,
    }
  );
  if (result.length > 0) {
    return true;
  } else {
    return false;
  }
};

export const updateUser = async ({
  userId,
  userName,
  userMail,
  profileImgUrl,
  encryptedPassword,
  userBio = null,
  userSkills = null,
  userWebsiteURL = null,
  userLocation = null,
}) => {
  const result = await Users.update(
    {
      first_name: userName,
      email: userMail,
      profile_img_url: profileImgUrl,
      password_hash: encryptedPassword,
      bio: userBio,
      website_url: userWebsiteURL,
      location: userLocation,
      skills: userSkills,
    },
    {
      where: {
        id: userId,
      },
    }
  );

  return result;
};

export const getUserInfo = async ({ userId, currentUserId }) => {
  const result = await sequelize.query(
    `
    WITH
    RECENT_POST AS (
      SELECT
        P.ID AS "recentPostId",
        P.USER_ID AS "recentPostUserId",
        P.CREATED_AT AS "recentPostCreatedAt",
        P.TITLE_IMG_URL AS "titleImgURL",
        P.TITLE,
        PA.LIKES,
        PA.COMMENTS
      FROM
        POSTS P
        JOIN POST_ANALYTICS PA ON PA.POST_ID = P.ID
      WHERE
        P.USER_ID =:userId
      ORDER BY
        P.CREATED_AT DESC
      LIMIT
        1
    ),
    RECENT_COMMENT AS (
      SELECT
        PC.ID,
        PC.USER_ID AS "postCommentUserId",
        PC.POST_ID,
        PC.CONTENT,
        PC.PARENT_ID,
        PC.CREATED_AT AS "recentCommentCreatedAt",
        P.USER_ID AS "postAuthorUserId",
        P.TITLE_IMG_URL AS "titleImgURL"
      FROM
        POST_COMMENTS PC
        JOIN POSTS P ON P.ID = PC.POST_ID
      WHERE
        PC.USER_ID =:userId
        AND PC.CONTENT <> 'NA-#GOHST'
      ORDER BY
        PC.CREATED_AT DESC
      LIMIT
        1
    ),
    TOTAL_POST_LIKES AS (
      SELECT
        SUM(PA.LIKES) AS TOTAL_LIKES,
        P.USER_ID
      FROM
        POSTS P
        JOIN POST_ANALYTICS PA ON P.ID = PA.POST_ID
      WHERE
        P.USER_ID =:userId
      GROUP BY
        P.USER_ID
    ),
    HAS_FOLLOWED AS (
      SELECT
        FOLLOWER_ID,USER_ID
      FROM
        FOLLOWERS
      WHERE
        USER_ID =:userId -- userId
        AND FOLLOWER_ID =:currentUserId --- currentUserId
    ),
    HAS_FOLLOWING AS (
      SELECT
        USER_ID,FOLLOWER_ID
      FROM
        FOLLOWERS
      WHERE
        USER_ID =:currentUserId 
        AND FOLLOWER_ID =:userId 
    )
  SELECT
    U.ID AS "userId",
    U.EMAIL,
    U.FIRST_NAME AS "firstName",
    U.REGISTERED_AT AS "registeredAt",
    U.PROFILE_IMG_URL AS "profileImgURL",
    U.BIO,
    U.SKILLS,
    U.WEBSITE_URL AS "websiteURL",
    U.LOCATION,
    U.POSTS AS "totalUserPosts",
    U.COMMENTS AS "totalUserComments",
    HF.FOLLOWER_ID AS "isFollowed",
    HFING.USER_ID  AS "isFollowing",
    FA.FOLLOWERS AS "totalUserFollowers",
    FA.FOLLOWING AS "totalUserFollowings",
    TPL.TOTAL_LIKES AS "totalOwnPostsLikes",
    RP."recentPostId" AS "recentPostId",
    RP."recentPostUserId" AS "recentPostUserId",
    RP."recentPostCreatedAt" AS "recentPostCreatedAt",
    RP."titleImgURL" AS "titleImgURL",
    RP."title",
    RP."likes" AS "recentPostLikes",
    RP."comments" AS "recentComments",
    RC.ID AS "commentId",
    RC."postCommentUserId" AS "postCommentUserId",
    RC.POST_ID AS "recentCommentPostId",
    RC.CONTENT,
    RC.PARENT_ID AS "parentId",
    RC."titleImgURL" AS "recentCommentPostTitleImgURL",
    RC."recentCommentCreatedAt" AS "recentCommentCreatedAt",
    RC."postAuthorUserId" AS "postAuthorUserId",
    (CASE WHEN HF.FOLLOWER_ID IS NOT NULL AND HFING.USER_ID IS NOT NULL THEN TRUE ELSE FALSE END) AS "isMutual"
  FROM
    USERS U
    LEFT JOIN RECENT_POST RP ON RP."recentPostUserId" = U.ID
    LEFT JOIN RECENT_COMMENT RC ON RC."postCommentUserId" = U.ID
    LEFT JOIN HAS_FOLLOWED HF ON HF.USER_ID = U.ID
    LEFT JOIN HAS_FOLLOWING HFING ON HFING.FOLLOWER_ID = U.ID
    LEFT JOIN TOTAL_POST_LIKES TPL ON TPL.USER_ID = U.ID
    LEFT JOIN FOLLOWER_ANALYTICS FA ON FA.USER_ID = U.ID
  WHERE
    U.ID =:userId

  `,
    {
      replacements: {
        currentUserId,
        userId,
      },
      type: QueryTypes.SELECT,
    }
  );

  return result[0];
};



export const updateRefreshToken = async ({ userId, refreshToken }) => {
  const res = await Users.update(
    {
      refresh_token: refreshToken,
    },
    {
      where: {
        id: userId,
      },
    }
  );

  return res;
};

export const getRefreshToken = async ({ userId }) => {
  const res = await Users.findOne({
    attributes: ["refresh_token"],
    where: {
      id: userId,
    },
  });

  return res.refresh_token;
};

export const getTotalUserPosts = async ({ userId }) => {
  const result = await Users.findOne({
    where: {
      id: userId,
    },
    attributes: ["posts"],
  });

  return result;
};

export const incUserPostsCount = async ({ userId }) => {
  const result = await Users.increment("posts", {
    by: 1,
    where: {
      id: userId,
    },
  });

  return result;
};

export const getAllUserFollowers = async ({ userId }) => {
  const result = await Users.findAll({
    include: [
      {
        model: Followers,
        where: {
          follower_id: userId,
        },
      },
    ],
  });
  return result;
};
