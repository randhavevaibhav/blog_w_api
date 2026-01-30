import {
  createPostLike,
  checkIfPostLikedByUser,
} from "../../../model/PostLikes/quires.js";

import { catchAsync } from "../../../utils/catchAsync.js";

export const likePostController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { postId } = req.body;

  //check if post is already liked by user
  const isPostLiked = await checkIfPostLikedByUser({ userId, postId });

  if (isPostLiked) {
    //already liked !
    return res.sendStatus(204);
  }

  //if not like post
  const createPostLikeResult = await createPostLike({
    userId,
    postId,
  });

  return res.status(200).send({
    message: "liked a post !",
    liked: true,
  });
});
