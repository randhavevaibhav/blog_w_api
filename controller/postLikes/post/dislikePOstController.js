import { decPostLike, getPostAnalytics } from "../../../model/PostAnalytics/quries.js";
import {  removeUserPostLike } from "../../../model/PostLikes/quries.js";


export const dislikePostController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const postId = req.params.postId;
    const { createdAt } = req.body;

    if (!userId || !postId || !createdAt) {
      return res.status(400).send({
        message: "Please send all required fields. userId,postId,createdAt.",
      });
    }

    const totalLikes = await getPostAnalytics(postId);
    // console.log("totalLikes ===> ",Number(totalLikes.likes));

    if(Number(totalLikes.likes)>0)
    {
        const removePostLikeResult = await removeUserPostLike(userId, postId);
        const decPostLikeResult = await decPostLike(postId);
        // console.log("result in removePostLikeResult =======> ",removePostLikeResult);
        // console.log("result in removePostLikeResult =======> ",decPostLikeResult);
    
        return res.status(200).send({
          message: "un-liked a post !",
          liked: false,
        });

    }else{
        return res.status(304).send({
            message: "invalid"
          });
    }
   
  } catch (error) {
    console.log("Error ocuured in likePostController ====> ", error);
    res.status(500).send({
      message: "Internal server error.",
    });
  }
};
