import { Op, QueryTypes } from "sequelize";
import sequelize from "../../db.js";
import { PostComments, Posts, Users } from "../associations.js";
import { Followers } from "../Followers/Followers.js";
import { FollowerAnalytics } from "../FollowerAnalytics/FollowerAnalytics.js";
import { PostAnalytics } from "../PostAnalytics/PostAnalytics.js";

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
    },
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
    },
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
    },
  );

  return result;
};

export const getUserInfo = async ({
  userId,
  currentUserId,
}) => {
  const result = Users.findOne({
    attributes: [
      ["first_name", "firstName"],
      "email",
      ["registered_at", "registeredAt"],
      ["profile_img_url", "profileImgURL"],
      "bio",
      "skills",
      ["website_url", "websiteURL"],
      "location",
      ["posts", "totalUserPosts"],
      ["comments", "totalUserComments"],
    ],
    include: [

      {
        model: Followers,
        where: {
          user_id: userId,
          follower_id: currentUserId,
        },
        required: false,
      },
       {
        model: FollowerAnalytics,
        where: {
          user_id: userId,
        },
        required: false,
      }
    ],
    where: {
      id: userId,
    },
    raw: true,
    // logging: true,
  });
  //  return result[0][0];
  return result;
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
    },
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
