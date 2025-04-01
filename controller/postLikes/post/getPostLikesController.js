import { getPostAnalytics } from "../../../model/PostAnalytics/quries.js";
import { isPostLikedByUser } from "../../../model/PostLikes/quries.js";

export const getPostLikesController = async (req, res) => {
  try {
    const currentUserId = req.params.currentUserId;
    const postId = req.params.postId;
    let likedByUser = false;
    // console.log("postId ==> ",postId)
    if (!postId || !currentUserId) {
      return res.status(400).send({
        message: "Please send all required fields. postId,currentUserId",
      });
    }

    const totalLikes = await getPostAnalytics(postId);
    const isLikedByUser = await isPostLikedByUser(currentUserId, postId);
    if (isLikedByUser) {
        likedByUser = true;
      }
    // console.log("totalLikes ==> ",totalLikes)
    // console.log("totalLikes ===> ",Number(totalLikes.likes));
    res.status(200).send({
      message: "fetched total post likes.",
      likes: Number(totalLikes.likes),
      likedByUser,
    });
  } catch (error) {
    console.log("Error ocuured in getPostLikesController ====> ", error);
    res.status(500).send({
      message: "Internal server error.",
    });
  }
};
