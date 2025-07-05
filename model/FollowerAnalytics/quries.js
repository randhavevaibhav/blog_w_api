import sequelize from "../../db.js";
import { FollowerAnalytics } from "./FollowerAnalytics.js";

export const createFollowerAnalytics = async ({ userId }) => {
  const result = await FollowerAnalytics.create({
    user_id: userId,
    followers: 0,
    following: 0,
  });
  return result;
};

export const deleteFollowerAnalytics = async ({ userId }) => {
  const result = await FollowerAnalytics.destroy({
    where: {
      user_id: userId,
    },
  });
  return result;
};

export const getFollowerAnalytics = async ({ userId }) => {
  const result = await FollowerAnalytics.findOne({
    attributes: ["followers", "following"],
    where: {
      user_id: userId,
    },
  });

  return result;
};

export const incFollowerCount = async ({ userId }) => {
  const result = await FollowerAnalytics.increment("followers", {
    by: 1,
    where: {
      user_id: userId,
    },
  });

  return result;
};

export const decFollowerCount = async ({ userId }) => {
  const result = await sequelize.query(`UPDATE follower_analytics
  SET followers = CASE
      WHEN followers > 0 THEN followers - 1
      ELSE 0
  END
  WHERE user_id = ${userId};`);

  return result;
};

export const incFollowingCount = async ({ userId }) => {
  const result = await FollowerAnalytics.increment("following", {
    by: 1,
    where: {
      user_id: userId,
    },
  });

  return result;
};

export const decFollowingCount = async ({ userId }) => {
  const result = await FollowerAnalytics.decrement("following", {
    by: 1,
    where: {
      user_id: userId,
    },
  });

  return result;
};
