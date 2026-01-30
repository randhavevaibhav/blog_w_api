import {
  createCommentLikeTransaction,
  isCommentLikedByUser,
} from "../../../model/CommentLikes/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const likeCommentController = catchAsync(async (req, res) => {
  const { commentId } = req.body;
  const { userId } = req.user;

  //check if comment is already liked by user
  const isCommentLiked = await isCommentLikedByUser({ userId, commentId });

  if (isCommentLiked) {
    //already liked
    return res.sendStatus(204);
  }

  //if not like post
  const createCommentLikeResult = await createCommentLikeTransaction({
    userId,
    commentId,
  });

  return res.status(200).send({
    message: "liked a comment !",
    liked: true,
  });
});
