import { getPost } from "../../../model/Posts/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const getIndividualPostController = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  let currentUserId = null;
  if (req.user) {
    currentUserId = req.user.userId;
  }
  const postResult = await getPost({
    postId,
    currentUserId,
  });

  if (!postResult) {
    return res.status(404).send({
      message: "Post not found !!",
    });
  }

  return res.status(200).send({
    message: `post fetched.`,
    postData: postResult,
  });
});
