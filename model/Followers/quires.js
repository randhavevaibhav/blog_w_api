import { QueryTypes } from "sequelize";
import sequelize from "../../db.js";
import { FOLLOWERS_LIMIT, FOLLOWING_LIMIT } from "../../utils/constants.js";
import { Followers } from "./Followers.js";
import { getFollowerAnalytics } from "../FollowerAnalytics/quires.js";
import { FollowerAnalytics } from "../FollowerAnalytics/FollowerAnalytics.js";

export const createNewFollowerTransaction = async ({
  userId,
  followingUserId,
}) => {
  const result = await sequelize.transaction(async (t) => {
    const createNewFollowerResult = await Followers.create(
      {
        user_id: followingUserId,
        follower_id: userId,
        created_at: new Date(),
      },
      {
        transaction: t,
      }
    );

    const getFollowingAnalyticsResult = await getFollowerAnalytics({
      userId: followingUserId,
    });

    const getUserFollowingAnalyticsResult = await getFollowerAnalytics({
      userId,
    });

    if (!getFollowingAnalyticsResult) {
      await FollowerAnalytics.create(
        {
          user_id: followingUserId,
          followers: 0,
          following: 0,
        },
        {
          transaction: t,
        }
      );
    }

    if (!getUserFollowingAnalyticsResult) {
      await FollowerAnalytics.create(
        {
          user_id: userId,
          followers: 0,
          following: 0,
        },
        {
          transaction: t,
        }
      );
    }

    await FollowerAnalytics.increment("followers", {
      by: 1,
      where: {
        user_id: followingUserId,
      },
      transaction: t,
    });

    await FollowerAnalytics.increment("following", {
      by: 1,
      where: {
        user_id: userId,
      },
      transaction: t,
    });

    return {
      createNewFollowerResult,
    };
  });

  return result;
};

export const removeFollowerTransaction = async ({
  userId,
  followingUserId,
}) => {
  const result = await sequelize.transaction(async (t) => {
    const removeFollowerResult = await Followers.destroy({
      where: {
        user_id: followingUserId,
        follower_id: userId,
      },
      transaction: t,
    });

    const decFollowerCountResult = await sequelize.query(
      `UPDATE follower_analytics
        SET followers = CASE
        WHEN followers > 0 THEN followers - 1
        ELSE 0
        END
        WHERE user_id=:userId`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );

    const decFollowingCountResult = await sequelize.query(
      `UPDATE follower_analytics
        SET following = CASE
        WHEN following > 0 THEN following - 1
        ELSE 0
        END
        WHERE user_id=:userId`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );

    return {
      removeFollowerResult,
      decFollowerCountResult,
      decFollowingCountResult,
    };
  });

  return result;
};

export const getUserFollowers = async ({ userId, offset }) => {
  const result = await sequelize.query(
    `select 
f.user_id,
f.follower_id,
u.first_name,
u.email,
u.profile_img_url,
f.created_at
from followers f
join users u on u.id=follower_id
where f.user_id=:userId
offset :offset
limit ${FOLLOWERS_LIMIT}
 `,
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

export const getUserFollowings = async ({ userId, offset }) => {
  const result = await sequelize.query(
    `select 
u.id,
u.first_name,
u.email,
u.profile_img_url,
f.created_at
from followers f
join users u on u.id=f.user_id
where f.follower_id=:userId
offset :offset
limit ${FOLLOWING_LIMIT}
 `,
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

export const checkIfAlreadyFollowed = async ({ userId, followingUserId }) => {
  const result = await Followers.findOne({
    where: {
      user_id: followingUserId,
      follower_id: userId,
    },
  });

  return result;
};
