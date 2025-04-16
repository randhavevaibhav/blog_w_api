import sequelize from "../../db.js";
import { Users } from "./Users.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
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

export const checkIfUserExistWithId = async ({ id }) => {
  const user = await Users.findOne({ where: { id: id } });

  return user;
};

export const updateUser = async ({
  userId,
  userName,
  userMail,
  incriptedPassword,
}) => {
  const result = await Users.update(
    {
      first_name: userName,
      email: userMail,
      password_hash: incriptedPassword,
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
    attributes: ["first_name", "email", "registered_at"],
    where: {
      id: userId,
    },
  });
  return result;
};
