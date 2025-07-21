import {
  createPostHashtags,
  deletePostHashtags,
} from "../../../model/PostHashtags/quires.js";
import { updatePost } from "../../../model/Posts/quires.js";
import { redisClient } from "../../../redis.js";
import { postsRedisKeys } from "../../../rediskeygen/posts/postsRedisKeys.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const updatePostController = catchAsync(async (req, res, next) => {
  const { postId, title, content, titleImgURL, updatedAt, tagList } = req.body;
  const { getIndividualPostRedisKey } = postsRedisKeys();
  // console.log("postId, title, content, titleImgURL ,updatedAt =====>",postId, title, content, titleImgURL ,updatedAt)

  if (!postId || !title || !content || !updatedAt) {
    return next(new AppError(`please send all required fields postId`));
  }

  const formattedPostId = parseInt(postId);

  if (!isPositiveInteger(formattedPostId)) {
    return next(new AppError(`postId must be number`));
  }

  if (tagList) {
    if (!Array.isArray(tagList)) {
      return next(new AppError(`tagList must be an array.`));
    }
    if (tagList.length === 0) {
      await deletePostHashtags({
        postId,
      });
    } else if (tagList.length > 0) {
      await deletePostHashtags({
        postId,
      }).then(async () => {
        await createPostHashtags({
          postId,
          hashtagIdList: tagList,
        }).catch((error) => {
          return next(
            new AppError(`Error while updating post hashtags. ${error}`)
          );
        });
      });
    }
  }

  const updatePostData = { postId, title, content, titleImgURL, updatedAt };
  const result = await updatePost(updatePostData);
  if (result[0] === 0) {
    return res.sendStatus(304);
  }
  // Invalidate redis cache

  await redisClient.del(
    getIndividualPostRedisKey({
      postId,
    })
  );
  // console.log("result in updatePostController ====> ",result);

  res.status(200).send({
    message: "post updated !!",
    postId,
  });
});
