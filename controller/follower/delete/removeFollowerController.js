import { removeFollowerTransaction } from "../../../model/Followers/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";


export const removeFollowerController = catchAsync(async (req, res) => {
  const {userId} = req.user;
  const followingUserId = req.params.followingUserId;

  const {removeFollowerResult} = await removeFollowerTransaction({
    userId,
    followingUserId,
  });

  if (removeFollowerResult == 0) {
    return res.status(200).send({
      message: `already un-followed !`,
      followed: false,
    });
  }

  return res.status(200).send({
    message: `un-followed user !`,
    followed: false,
  });
});
