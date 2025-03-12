import {
  createPostAnalytics,
  decPostLike,
  getPostAnalytics,
  incPostLike,
} from "../../../model/PostAnalytics/quries.js";
import {
  createPostLike,
  isPostLikedByUser,
  removePostLike,
} from "../../../model/PostLikes/quries.js";

export const createPostLikeController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const postId = req.params.postId;
    const { createdAt } = req.body;
    if (!userId || !postId || !createdAt) {
      return res.status(400).send({
        message: "Please send all required fields. userId,postId,createdAt.",
      });
    }

    const isPostLiked = await isPostLikedByUser(userId, postId);

    if (isPostLiked) {
      const removePostLikeResult = await removePostLike(userId, postId);
      const decPostLikeResult = await decPostLike(postId);
      // console.log("result in removePostLikeResult =======> ",removePostLikeResult);
      // console.log("result in removePostLikeResult =======> ",decPostLikeResult);

      return res.status(200).send({
        message: "unliked post !",
        liked: false,
      });
    }

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

    // console.log("result in createPostLikeResult =======> ",createPostLikeResult);

    // console.log("result in incPostLikeResult =======> ",incPostLikeResult)

    return res.status(200).send({
      message: "liked a post !",
      liked: true,
    });
  } catch (error) {
    console.log("Error occured in createPostLikeController ====> ", error);
    return res.status(500).send({
      message: "Internal server error.",
    });
  }
};
