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
  userSkills=null,
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
      skills:userSkills
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
  // const result = sequelize.query(`select u.first_name,u.registered_at,u.email from users u where u.id= ${userId}`);
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
