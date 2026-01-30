import {
  checkIfPostLikedByUser,
  removeUserPostLike,
} from "../../../model/PostLikes/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";


export const dislikePostController = catchAsync(async (req, res) => {
  const {userId} = req.user;
  const { postId } = req.body;

  const isPostLiked = await checkIfPostLikedByUser({ userId, postId });

  if (!isPostLiked) {
    //already dis-liked !
    return res.sendStatus(204);
  }

  const removePostLikeResult = await removeUserPostLike({ userId, postId });

  // console.log("result in removePostLikeResult =======> ",removePostLikeResult);
  // console.log("result in removePostLikeResult =======> ",decPostLikeResult);

  return res.status(200).send({
    message: "disliked a post !",
    liked: false,
  });
});
