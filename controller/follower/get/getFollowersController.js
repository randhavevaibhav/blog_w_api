import { getUserFollowers } from "../../../model/Followers/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import {  FOLLOWERS_OFFSET } from "../../../utils/constants.js";


export const getFollowersController = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { offset } = req.query;

  const result = await getUserFollowers({ userId ,offset});

  const formattedResult = result.map((follower) => {
    return {
      userId: follower.user_id,
      followerId: follower.follower_id,
      profileImgURL: follower.profile_img_url,
      followerName: follower.first_name,
      followerMail: follower.email,
      createdAt: follower.created_at,
    };
  });

  if (result.length == 0) {
    return res.status(200).send({
      message: `No followers found.`,
      followers: [],
    });
  }

  return res.status(200).send({
    message: "found user followers",
    userId,
    followers: formattedResult,
    offset: Number(offset) + FOLLOWERS_OFFSET,
  });
});
