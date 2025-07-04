import { getUserFollowings } from "../../../model/Followers/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { FOLLOWING_OFFSET } from "../../../utils/constants.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const getFollowingsController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const { offset } = req.query;

  if (!userId || !offset) {
    return next(new AppError(`userId or offset is not present`, 400));
  }

  const formattedUserId = parseInt(userId);
  const formattedOffset = parseInt(offset);
  if (!isPositiveInteger(formattedOffset)) {
    return next(new AppError(`offset must be a number`, 400));
  }
  if (!isPositiveInteger(formattedUserId)) {
    return next(new AppError(`userId must be a number`, 400));
  }

  const result = await getUserFollowings({ userId ,offset});

  const formatedResult = result.map((followingUser) => {
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
    followings: formatedResult,
     offset: Number(offset) + FOLLOWING_OFFSET,
  });
});
