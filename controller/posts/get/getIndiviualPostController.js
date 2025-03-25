import { isPostLikedByUser } from "../../../model/PostLikes/quries.js";
import { getPost } from "../../../model/Posts/quries.js";

export const getIndiviualPostController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const postId = req.params.postId;
    const currentUserId = req.params.currentUserId;
    let likedByUser = false;
    // console.log("userId getIndiviualPostController ====> ",userId)
    // console.log("postId getIndiviualPostController ====> ",postId)

    if (!userId || !postId || !currentUserId) {
      return res.status(400).send({
        message: `Please send all required fields. userId,currentUserId,postId`,
      });
    }

    const result = await getPost(postId);
    // console.log("result from getIndiviualPostController ==>  ",result)

    if (result) {
      const postData = {
        userName: result.first_name,
        title: result.title,
        content: result.content,
        title_img_url: result.title_img_url,
        totalLikes: result.likes,
        created_at: result.created_at,
        totalComments: result.comments,
      };
      // console.log("postData  result ===> ", postData);
      const isLikedByUser = await isPostLikedByUser(currentUserId, postId);

      if (isLikedByUser) {
        likedByUser = true;
      }

      return res.status(200).send({
        message: `post fetched.`,
        postData,
        likedByUser,
      });
    } else {
      return res.status(404).send({
        message: `No post found.`,
      });
    }
  } catch (error) {
    console.log("Error ocuured in getIndiviualPostController ==> ", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
