import { getPost } from "../../../model/Posts/quires.js";

import { catchAsync } from "../../../utils/catchAsync.js";
import { getAllPostHashtags } from "../../../model/PostHashtags/quires.js";

export const getIndividualPostController = catchAsync(
  async (req, res) => {
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
      postId: postResult.id,
      userName: postResult.users.first_name,
      userProfileImg: postResult.users.profile_img_url,
      title: postResult.title,
      content: postResult.content,
      titleImgURL: postResult.title_img_url,
      createdAt: postResult.created_at,
      tagList,
    };

    return res.status(200).send({
      message: `post fetched.`,
      postData: formattedPost,
    });
  }
);
