import { getUserFollowers } from "../../../model/Followers/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { FOLLOWERS_OFFSET } from "../../../utils/constants.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const getFollowersController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { offset } = req.query;

  if (!userId||!offset) {
    return next(new AppError(`userId or offset is not present`, 400));
  }

  const formattedOffset = parseInt(offset);
  const formattedUserId = parseInt(userId);

  if (!isPositiveInteger(formattedOffset)) {
    return next(new AppError(`offset must be a number`, 400));
  }

  if (!isPositiveInteger(formattedUserId)) {
    return next(new AppError(`userId must be a number`, 400));
  }

  const result = await getUserFollowers({ userId ,offset});

  const formatedResult = result.map((follower) => {
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
    followers: formatedResult,
    offset: Number(offset) + FOLLOWERS_OFFSET,
  });
});
