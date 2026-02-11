import { getUserFollowers } from "../../../model/Followers/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import {  FOLLOWERS_OFFSET } from "../../../utils/constants.js";


export const getFollowersController = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { offset } = req.query;
   const { sort } = req.query;
  const { mutual } = req.query;
  const result = await getUserFollowers({ userId ,offset,sort,mutual});

  if (result.length == 0) {
    return res.status(200).send({
      message: `No followers found.`,
      followers: [],
    });
  }

  return res.status(200).send({
    message: "found user followers",
    userId,
    followers: result,
    offset: Number(offset) + FOLLOWERS_OFFSET,
  });
});
