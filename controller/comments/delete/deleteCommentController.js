import { decCommentCount, isCommentCountZero } from "../../../model/PostAnalytics/quries.js";
import { deleteSinglePostComment } from "../../../model/PostComments/quiries.js";

export const deleteCommentController = async (req, res) => {
  try {
    const { userId, commentId,postId } = req.body;

    if (!userId || !commentId||!postId) {
      return res.status(400).send({
        message: "Please send all required fields. userId,commentId,postId",
      });
    }

    //delete comment from post_comments table
    const result = await deleteSinglePostComment(userId, commentId);
    //decrease the comment count in post_analytics table if it is not zero
    const isCommentCount = await isCommentCountZero(postId)
    // console.log("isCommentCountZero ===> ",isCommentCount)
    if(!isCommentCount)
    {
      await decCommentCount(postId);
    }
   

    
    // console.log("result from deleteSinglePostComment ===> ", result);

    if (!result) {
      return res.sendStatus(304);
    }

    return res.status(200).send({
      message: "comment deleted!",
    });
  } catch (error) {
    console.log("Error ocuured in deleteCommentController ===> ", error);
    res.status(500).send({
      message: "Internal server error.",
    });
  }
};
