import sequelize from "../../db.js";
import { FOLLOWERS_LIMIT, FOLLOWING_LIMIT } from "../../utils/constants.js";
import { Followers } from "./Followers.js";


export const createNewFollower = async ({ userId, followingUserId,createdAt }) => { 
  const result = await Followers.create({
    user_id: followingUserId,
    follower_id: userId,
    created_at:createdAt
  });

  return result;
};


export const getUserFollowers = async ({ userId ,offset}) => {

  const result = await sequelize.query(`select 
f.user_id,
f.follower_id,
u.first_name,
u.email,
u.profile_img_url,
f.created_at
from followers f
join users u on u.id=follower_id
where f.user_id=${userId}
offset ${offset}
limit ${FOLLOWERS_LIMIT}
 `);

  return result[0];
};


export const getUserFollowings = async ({ userId ,offset}) => {

  const result = await sequelize.query(`select 
u.id,
u.first_name,
u.email,
u.profile_img_url,
f.created_at
from followers f
join users u on u.id=f.user_id
where f.follower_id=${userId}
offset ${offset}
limit ${FOLLOWING_LIMIT}
 `);

  return result[0];
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


export const removeFollower = async ({ userId, followingUserId }) => {
  const result = await Followers.destroy({
    where: {
      user_id: followingUserId,
      follower_id: userId,
    },
  });

  return result;
};