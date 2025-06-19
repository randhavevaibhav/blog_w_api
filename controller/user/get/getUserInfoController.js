import { catchAsync } from "../../../utils/catchAsync.js";
import { AppError } from "../../../utils/appError.js";
import {
  checkIfUserExistWithId,
  getUserInfo,
} from "../../../model/Users/quries.js";
import { getAllUserPosts } from "../../../model/Posts/quries.js";
import { getOwnRecentComment } from "../../../model/PostComments/quiries.js";
import { isPositiveInteger } from "../../../utils/utils.js";
export const getUserInfoController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return next(new AppError(`Please send all required field. userId`, 400));
  }

  const formattedUserId = parseInt(userId);

  if (!isPositiveInteger(formattedUserId)) {
    return next(new AppError(`userId must be number`));
  }

  const isUserExist = await checkIfUserExistWithId({ userId });

  if (!isUserExist) {
    return next(new AppError(`User with id ${userId} does not exist.`, 404));
  }

  const userInfo = await getUserInfo({ userId });

  let formattedUserInfo = null;

  if (userInfo) {
    formattedUserInfo = {
      firstName: userInfo.first_name,
      email: userInfo.email,
      registeredAt: userInfo.registered_at,
      profileImgURL: userInfo.profile_img_url,
      bio: userInfo.bio,
      skills: userInfo.skills,
      websiteURL: userInfo.website_url,
      location: userInfo.location,
    };
  }

  // console.log("user info =====> ", formattedUserInfo);

  let totalComments = 0;
  let userPosts = await getAllUserPosts({ userId });
  let totalPosts = 0;
  let userComments = await getOwnRecentComment({ userId });

  let recentPost = null;
  let recentComment = null;

  if (!userPosts.length) {
    recentPost = null;
    totalPosts = 0;
  } else {
    let soretedUserPosts = userPosts.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    recentPost = soretedUserPosts[0];
    totalPosts = userPosts.length;
  }
  if (!userComments[0].length) {
    recentComment = null;
  } else {
    recentComment = userComments[0][0];
    totalComments = userComments[0].length;
  }

  return res.status(200).send({
    message: `fetched user info.`,
    userInfo: formattedUserInfo,
    totalComments,
    totalPosts,
    recentPost,
    recentComment,
  });
});
