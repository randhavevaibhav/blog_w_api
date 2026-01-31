import { getUserFollowings } from "../../../model/Followers/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import {  FOLLOWING_OFFSET } from "../../../utils/constants.js";


export const getFollowingsController = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { offset } = req.query;

  
  const result = await getUserFollowings({ userId ,offset});
  const formattedResult = result.map((followingUser) => {
    return {
      followingUserId: followingUser.id,
      profileImgURL: followingUser.profile_img_url,
      followingUserName: followingUser.first_name,
      followingUserMail: followingUser.email,
      createdAt: followingUser.created_at,
    };
  });

  if (result.length == 0) {
    return res.status(200).send({
      message: `No user followings found.`,
      followings: [],
    });
  }

  return res.status(200).send({
    message: "found user followings",
    userId,
    followings: formattedResult,
     offset: Number(offset) + FOLLOWING_OFFSET,
  });
});
