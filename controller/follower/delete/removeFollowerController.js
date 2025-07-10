import { decFollowerCount, decFollowingCount } from "../../../model/FollowerAnalytics/quires.js";
import { removeFollower } from "../../../model/Followers/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const removeFollowerController = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const followingUserId = req.params.followingUserId;

  if (!userId || !followingUserId) {
    return next(
      new AppError(
        `please provide all required fields. ==>  userId, followingUserId`
      )
    );
  }

  const formattedUserId = parseInt(userId);
  const formattedFollowingUserId = parseInt(followingUserId);
  if (
    !isPositiveInteger(formattedUserId) ||
    !isPositiveInteger(formattedFollowingUserId)
  ) {
    return next(new AppError(`userId, followingUserId must be numbers`));
  }

  const result = await removeFollower({
    userId,
    followingUserId,
  });

  if (result == 0) {
    return res.status(200).send({
      message: `already un-followed !`,
      followed: false,
    });
  }

  await decFollowerCount({
    userId:followingUserId
  })

  await decFollowingCount({
    userId
  })

  return res.status(200).send({
    message: `un-followed user !`,
    followed: false,
  });
});
