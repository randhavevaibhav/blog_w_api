import { createPostComment } from "../../../model/PostComments/quiries.js";
import { getPost } from "../../../model/Posts/quries.js";
import { checkIfUserExistWithId } from "../../../model/Users/quries.js";

export const createPostCommentController = async (req, res) => {
  try {
    // console.log("req.body ===> ", req.body);
    const { content, createdAt } = req.body;
    const userId = req.params.userId;
    const postId = req.params.postId;
    // console.log("postId,content,createdAt,likes ===> ", postId);

    if (!userId || !postId || !content || !createdAt) {
      return res.status(400).send({
        message:
          "Please send all required fields.userId, postId,content,createdAt",
      });
    }

    const isUserExist = await checkIfUserExistWithId(userId);
    if (!isUserExist) {
        return res.status(400).send({
          message: `user with user id ${userId} does not exist.`,
        });
      }

    const isPostExist = await getPost(userId, postId);

    if (!isPostExist) {
      return res.status(400).send({
        message: `post with post id ${postId} does not exist.`,
      });
    }

   
     const result = await createPostComment(userId,postId,content,createdAt);

   return res.status(200).send({
    message:"submitted new comment"
   })
  } catch (error) {
    console.log("Error occured in postCommentController ==> ", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
