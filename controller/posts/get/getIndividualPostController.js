import { getPost } from "../../../model/Posts/quires.js";

import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";

import { isPositiveInteger } from "../../../utils/utils.js";

import { getAllPostHashtags } from "../../../model/PostHashtags/quires.js";

export const getIndividualPostController = catchAsync(
  async (req, res, next) => {
    const userId = req.params.userId;
    const postId = req.params.postId;

    if (!userId || !postId) {
      return next(
        new AppError(`Please send all required fields. userId,postId`)
      );
    }

    const formattedUserId = parseInt(userId);
    const formattedPostId = parseInt(postId);

    if (
      !isPositiveInteger(formattedUserId) ||
      !isPositiveInteger(formattedPostId)
    ) {
      return next(new AppError(`userId, postId must be numbers`));
    }

    const postResult = await getPost({ postId });

    if (!postResult) {
      return res.status(404).send({
        message: "Post not found !!",
      });
    }

    let postData = null;
    const tagList = await getAllPostHashtags({
      postId,
    });

    postData = {
      userName: postResult.first_name,
      userProfileImg: postResult.profile_img_url,
      title: postResult.title,
      content: postResult.content,
      titleImgURL: postResult.title_img_url,
      createdAt: postResult.created_at,
      tagList,
    };

    return res.status(200).send({
      message: `post fetched.`,
      postData,
    });
  }
);
