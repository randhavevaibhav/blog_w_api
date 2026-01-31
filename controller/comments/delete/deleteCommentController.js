import {
  deleteSinglePostComment,
  updateCommentAsGhost,
} from "../../../model/PostComments/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";


export const deleteCommentController = catchAsync(async (req, res) => {
  const {userId} = req.user;
  const { commentId, postId, hasReplies } = req.params;
  const numHasReplies = parseInt(hasReplies);

 
  let result = null;
  let ghosted = false;

  //decrease the comment count in post_analytics table if it is not zero

  if (!numHasReplies) {
    // await decCommentCount(postId);
    result = await deleteSinglePostComment({ userId, commentId });
  }

  if (numHasReplies) {
    ghosted = true;
    await updateCommentAsGhost({ commentId, postId });
  }

  // console.log("result from deleteSinglePostComment ===> ", result);

  if (!result && !ghosted) {
    return res.sendStatus(304);
  }

  return res.status(200).send({
    message: "comment deleted!",
    commentId,
  });
});
