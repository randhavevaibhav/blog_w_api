import { catchAsync } from "../../../utils/catchAsync.js";
import { AppError } from "../../../utils/appError.js";
import {
  checkIfUserExistWithId,
  getUserInfo,
} from "../../../model/Users/quries.js";
import { getAllOwnPosts } from "../../../model/Posts/quries.js";
import { getOwnRecentComment } from "../../../model/PostComments/quiries.js";
export const getUserInfoController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return next(new AppError(`Please send all required field. userId`, 400));
  }

  const isUserExist = await checkIfUserExistWithId({ id: userId });

  if (!isUserExist) {
    return next(new AppError(`User with id ${userId} does not exist.`, 404));
  }

  const userInfo = await getUserInfo({ userId });

  let totalComments = 0;
  let userPosts = await getAllOwnPosts({ userId });
  let totalPosts = 0;
  let userComments = await getOwnRecentComment({ userId });

  let recentPost = null;
  let recentComment = null;
  // console.log("userPosts ===> ",userPosts[0])
  if (!userPosts[0].length) {
    recentPost = null;
    totalPosts = 0;
  } else {
    recentPost = userPosts[0][0];
    totalPosts = userPosts[0].length;
  }
  if (!userComments[0].length) {
    recentComment = null;
  } else {
    recentComment = userComments[0][0];
    totalComments = userComments[0].length;
  }

  return res.status(200).send({
    message: `fetched user info.`,
    userInfo,
    totalComments,
    totalPosts,
    recentPost,
    recentComment,
  });
});
