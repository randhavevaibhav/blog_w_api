import { Users } from "./users.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
export const createUser = async (
  firstName,
  email,
  incriptedPassword,
  registered_at
) => {
  const result = await Users.create({
    first_name: firstName,
    email,
    password_hash: incriptedPassword,
    registered_at,
  });

  return result;
};

export const checkIfUserExistWithMail = async (email) => {
  const user = await Users.findOne({ where: { email: email } });

  return user;
};

export const checkIfUserExistWithId = async (id) => {
  const user = await Users.findOne({ where: { id: id } });

  return user;
};

export const updateUser = async (userId, userName, userMail,incriptedPassword) => {
  const result = await Users.update(
    {
      first_name: userName,
      email: userMail,
      password_hash:incriptedPassword
    },
    {
      where: {
        id: userId,
      },
    }
  );

  return result;
};
