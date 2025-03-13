import {
  createPostAnalytics,
  getPostAnalytics,
  incPostLike,
} from "../../../model/PostAnalytics/quries.js";
import { createPostLike, isPostLikedByUser } from "../../../model/PostLikes/quries.js";

export const likePostController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const postId = req.params.postId;
    const { createdAt } = req.body;

    if (!userId || !postId || !createdAt) {
      return res.status(400).send({
        message: "Please send all required fields. userId,postId,createdAt.",
      });
    }

    //check if post is already liked by user
    const isPostLiked = await isPostLikedByUser(userId, postId);

    if(isPostLiked)
    {
        return res.status(304).send({
            message:"post already liked",
            liked: true,
        })
    }

    //if not like post
    const createPostLikeResult = await createPostLike(
      userId,
      postId,
      createdAt
    );
    
    const isPostAnalyticsPresent = await getPostAnalytics(postId);

    if (!isPostAnalyticsPresent) {
      const createPostAnalyticsResult = await createPostAnalytics(postId);
      // console.log("result in createPostAnalyticsResult =======> ",createPostAnalyticsResult);
    }
    const incPostLikeResult = await incPostLike(postId);
    return res.status(200).send({
        message: "liked a post !",
        liked: true,
      });
  } catch (error) {
    console.log("Error ocuured in likePostController ====> ", error);
    res.status(500).send({
      message: "Internal server error.",
    });
  }
};
