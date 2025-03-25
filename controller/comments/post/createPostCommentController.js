import { incCommentCount } from "../../../model/PostAnalytics/quries.js";
import { createPostComment } from "../../../model/PostComments/quiries.js";

export const createPostCommentController = async (req, res) => {
  try {
    // console.log("req.body ===> ", req.body);
    const { content, createdAt } = req.body;
    const userId = req.params.userId;
    const postId = req.params.postId;
    // console.log("postId,content,createdAt,likes ===> ", postId);

    // console.log("userId  createPostCommentController ===> ",userId)
    // console.log("postId  createPostCommentController ===> ",postId)

    if (!userId || !postId || !content || !createdAt) {
      return res.status(400).send({
        message:
          "Please send all required fields.userId, postId,content,createdAt",
      });
    }

    const result = await createPostComment(userId, postId, content, createdAt);
    const resultOfincCommentCount = await incCommentCount(postId);

    // console.log("resultOfincCommentCount ===> ",JSON.stringify(resultOfincCommentCount))

    return res.status(200).send({
      message: "submitted new comment",
    });
  } catch (error) {
    console.log("Error occured in postCommentController ==> ", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
