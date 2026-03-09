import {
  createPostLike,
} from "../../../model/PostLikes/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const likePostController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { postId } = req.body;
 
  const createPostLikeResult = await createPostLike({
    userId,
    postId,
  });

   if(createPostLikeResult===0)
  {
    return res.status(200).send({
      message:"not modified"
    })
  }

  return res.status(200).send({
    message: "liked a post !",
    liked: true,
  });
});
