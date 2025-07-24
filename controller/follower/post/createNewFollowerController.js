import {
  createFollowerAnalytics,
  getFollowerAnalytics,
  incFollowerCount,
  incFollowingCount,
} from "../../../model/FollowerAnalytics/quires.js";
import {
  checkIfAlreadyFollowed,
  createNewFollower,
} from "../../../model/Followers/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const createNewFollowerController = catchAsync(
  async (req, res, next) => {
    const { userId, followingUserId, createdAt } = req.body

    if (!userId || !followingUserId || !createdAt) {
      return next(
        new AppError(
          `please provide all required fields. ==>  userId, followingUserId,createdAt`
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

    const isAlreadyFollowed = await checkIfAlreadyFollowed({
      userId,
      followingUserId,
    });

    if (isAlreadyFollowed) {
      return res.status(200).send({
        message: "already followed !",
        followed: true,
      });
    }

    const result = await createNewFollower({
      userId,
      followingUserId,
      createdAt,
    });

    const getFollowingAnalyticsResult = await getFollowerAnalytics({
      userId: followingUserId,
    });

    const getUserFollowingAnalyticsResult = await getFollowerAnalytics({
      userId,
    });

    if (!getFollowingAnalyticsResult) {
      await createFollowerAnalytics({
        userId: followingUserId,
      });
    }

    if (!getUserFollowingAnalyticsResult) {
      await createFollowerAnalytics({
        userId,
      });
    }

    await incFollowerCount({
      userId: followingUserId,
    });

    await incFollowingCount({
      userId,
    });

    res.status(201).send({
      message: `followed new user`,
      followed: true,
    });
  }
);
