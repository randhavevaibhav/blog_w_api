import { updatePost } from "../../../model/Posts/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const updatePostController = catchAsync(async (req, res, next) => {
  const { postId, title, content, titleImgURL, updatedAt } = req.body;
  // console.log("postId, title, content, titleImgURL ,updatedAt =====>",postId, title, content, titleImgURL ,updatedAt)

  if (!postId || !title || !content || !updatedAt) {
    return next(new AppError(`please send all required fields postId`));
  }

  const formattedPostId = parseInt(postId);

  if (!isPositiveInteger(formattedPostId)) {
    return next(new AppError(`postId must be number`));
  }

  const updatePostData = { postId, title, content, titleImgURL, updatedAt };
  const result = await updatePost(updatePostData);
  if (result[0] === 0) {
    return res.sendStatus(304);
  }
  // console.log("result in updatePostController ====> ",result);

  res.status(200).send({
    message: "post updated !!",
    postId,
  });
});
