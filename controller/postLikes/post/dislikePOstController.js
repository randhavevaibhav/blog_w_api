import {
  removeUserPostLike,
} from "../../../model/PostLikes/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const dislikePostController = catchAsync(async (req, res) => {
  const {userId} = req.user;
  const { postId } = req.body;
 
  const removePostLikeResult = await removeUserPostLike({ userId, postId });

  if(removePostLikeResult===0)
  {
    return res.status(200).send({
      message:"not modified"
    })
  }
  return res.status(200).send({
    message: "disliked a post !",
    liked: false,
  });
});
