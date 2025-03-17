import { deleteSinglePostComment } from "../../../model/PostComments/quiries.js";

export const deleteCommentController = async (req, res) => {
  try {
    const { userId, commentId } = req.body;

    if (!userId || !commentId) {
      return res.status(400).send({
        message: "Please send all required fields. userId,commentId",
      });
    }

    const result = await deleteSinglePostComment(userId, commentId);
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
