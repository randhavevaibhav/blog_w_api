import { deletePostAnalytics } from "../../../model/PostAnalytics/quires.js";
import { deletePostComments } from "../../../model/PostComments/quires.js";
import { deletePostHashtags } from "../../../model/PostHashtags/quires.js";
import { removeAllPostLikes } from "../../../model/PostLikes/quires.js";
import { deletePost, getPost } from "../../../model/Posts/quires.js";
import { decUserPostsCount } from "../../../model/Users/quires.js";
import { postsRedisKeys } from "../../../rediskeygen/posts/postsRedisKeys.js";
import { userRedisKeys } from "../../../rediskeygen/user/userRedisKeys.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { supabaseDeleteStorageFile } from "../../../utils/supabase.js";
import { isPositiveInteger } from "../../../utils/utils.js";

const getFilePathFromURL = (postTitleImgUrl) => {
  const urlArr = postTitleImgUrl.split("/");
  const urlArrLength = urlArr.length;
  const filePath = `${urlArr[urlArrLength - 1]}`;

  return filePath;
};

export const deletePostController = catchAsync(async (req, res, next) => {
  const bucket = `post-title-imgs`;
  const postId = req.params.postId;
  const userId = req.params.userId;
  const { getIndividualPostRedisKey } = postsRedisKeys();
  const { getUserInfoRedisKey } = userRedisKeys();
  if (!postId) {
    return next(new AppError(`please send all required field postId`));
  }

  const formattedPostId = parseInt(postId);
  const formattedUserId = parseInt(userId);

  if (
    !isPositiveInteger(formattedPostId) ||
    !isPositiveInteger(formattedUserId)
  ) {
    return next(new AppError(`userId, postId must be numbers`));
  }

  //get postTitleImgUrl
  const { title_img_url: postTitleImgUrl } = await getPost({ postId });
  // console.log("postTitleImgUrl ===>", postTitleImgUrl);

  if (postTitleImgUrl) {
    //get the file path
    const filePath = getFilePathFromURL(postTitleImgUrl);

    //delete from supabase storage

    const { data, error } = await supabaseDeleteStorageFile({
      filePath,
      bucket,
    });

    if (error) {
      throw new Error(`Error while deleting file on supabase ==> ${error}`);
    }

    // console.log("Delted file ===> ",data)
  }

  //delete post
  const result = await deletePost({ postId });
  //delete all comments related to that post
  const deletePostCommentsResult = await deletePostComments({ postId });

  await decUserPostsCount({
    userId,
  });

  //delete post analytics
  await deletePostAnalytics({ postId });
  //delete post likes
  await removeAllPostLikes({ postId });

  //delete all post hashtags
  await deletePostHashtags({
    postId,
  });

  //no post deleted
  if (result === 0) {
    return res.sendStatus(304);
  }

  //  console.log("result of deletepost query ===>", result);

  res.status(200).send({
    message: "post deleted !!",
    postId,
  });
});
