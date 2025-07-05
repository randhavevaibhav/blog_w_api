import sequelize from "../../db.js";
import { Users } from "./Users.js";

export const createUser = async ({
  firstName,
  email,
  incriptedPassword,
  registered_at,
  profileImgUrl,
}) => {
  const result = await Users.create({
    first_name: firstName,
    email,
    password_hash: incriptedPassword,
    registered_at,
    profile_img_url: profileImgUrl,
  });

  return result;
};

export const checkIfUserExistWithMail = async ({ email }) => {
  const user = await Users.findOne({ where: { email: email } });

  return user;
};

export const checkIfUserExistWithId = async ({ userId }) => {
  const user = await Users.findOne({ where: { id: userId } });

  return user;
};

export const updateUser = async ({
  userId,
  userName,
  userMail,
  profileImgUrl,
  incriptedPassword,
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
      password_hash: incriptedPassword,
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

export const getUserInfo = async ({ userId }) => {
  const result = Users.findOne({
    attributes: [
      "first_name",
      "email",
      "registered_at",
      "profile_img_url",
      "bio",
      "skills",
      "website_url",
      "location",
    ],
    where: {
      id: userId,
    },
  });
  //  return result[0][0];
  return result;
};

export const updateRefeshToken = async ({ userId, refreshToken }) => {
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
export const getTotalCommentCountOfUser = async ({ userId }) => {
  const result = await Users.findOne({
    where: {
      id: userId,
    },
    attributes: ["comments"],
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

export const decUserPostsCount = async ({ userId }) => {
  const result = await sequelize.query(`UPDATE users
  SET posts = CASE
      WHEN posts > 0 THEN posts - 1
      ELSE 0
  END
  WHERE id = ${userId};`);

  return result;
};

export const incUserCommentsCount = async ({ userId }) => {
  const result = await Users.increment("comments", {
    by: 1,
    where: {
      id: userId,
    },
  });

  return result;
};

export const decUserCommentsCount = async ({ userId }) => {
  const result = await sequelize.query(`UPDATE users
  SET comments = CASE
      WHEN comments > 0 THEN comments - 1
      ELSE 0
  END
  WHERE id = ${userId};`);

  return result;
};
