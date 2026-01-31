import { getPost } from "../../../model/Posts/quires.js";

import { catchAsync } from "../../../utils/catchAsync.js";
import { getAllPostHashtags } from "../../../model/PostHashtags/quires.js";

export const getIndividualPostController = catchAsync(async (req, res) => {
  const postId = req.params.postId;

  const postResult = await getPost({ postId });

  if (!postResult) {
    return res.status(404).send({
      message: "Post not found !!",
    });
  }
  const tagList = await getAllPostHashtags({
    postId,
  });

  const formattedPost = {
    postId: postResult.postId,
    userId: postResult["users.userId"],
    userName: postResult["users.userName"],
    userProfileImg: postResult["users.userProfileImg"],
    title: postResult.title,
    content: postResult.content,
    titleImgURL: postResult.titleImgURL,
    createdAt: postResult.createdAt,
    tagList,
  };

  return res.status(200).send({
    message: `post fetched.`,
    postData: formattedPost,
  });
});
