import { getPostAnalytics } from "../../../model/PostAnalytics/quries.js";
import { isPostLikedByUser } from "../../../model/PostLikes/quries.js";

export const getTotalPostLikesController = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    let likedByUser = false;
    if (!postId || !userId) {
      return res.status(400).send({
        message: "Please send all required fields. postId,userId",
      });
    }

    const getTotalPostLikesResult = await getPostAnalytics(postId);
    const isLikedByUser = await isPostLikedByUser(userId, postId);

    if (isLikedByUser) {
      likedByUser = true;
    }

    // console.log("getTotalPostLikesResult =====> ", getTotalPostLikesResult);

    return res.status(200).send({
      message: "fetched total likes.",
      totalLikes: getTotalPostLikesResult ? getTotalPostLikesResult.likes : 0,
      likedByUser,
    });
  } catch (error) {
    console.log("Error ocuurd in getTotalPostLikesController ====> ", error);
    return res.status(500).send({
      message: "Internal server error.",
    });
  }
};
