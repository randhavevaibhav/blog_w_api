import { decCommentLike } from "../../../model/CommentAnalytics/quires.js";
import {
  isCommentLikedByUser,
  removeCommentLike,
} from "../../../model/CommentLikes/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const dislikeCommentController = catchAsync(async (req, res) => {
  const { commentId } = req.body;
  const { userId } = req.user;

  const isCommentLiked = await isCommentLikedByUser({ userId, commentId });

  if (!isCommentLiked) {
    //already dis-liked !
    return res.sendStatus(204);
  }

  const removeCommentLikeResult = await removeCommentLike({
    userId,
    commentId,
  });

  const decCommentLikeResult = await decCommentLike({ commentId });
  // console.log("result in decCommentLikeResult =======> ",decCommentLikeResult);
  return res.status(200).send({
    message: "disliked a comment !",
    liked: false,
  });
});
