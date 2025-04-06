import { deletePostAnalytics } from "../../../model/PostAnalytics/quries.js";
import { deletePostComments } from "../../../model/PostComments/quiries.js";
import { removeAllPostLikes } from "../../../model/PostLikes/quries.js";
import { deletePost } from "../../../model/Posts/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const deletePostController = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;
  if (!postId) {
    return next(new AppError(`please send all required field postId`));
  }

  //delete post
  const result = await deletePost(postId);
  //delete all comments related to that post
  const deletePostCommentsResult = await deletePostComments(postId);
  //delete post analytics
  await deletePostAnalytics(postId);
  //delete post likes
  await removeAllPostLikes(postId);

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
