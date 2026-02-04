import { getAllTaggedPosts } from "../../../model/Posts/quires.js";

import { catchAsync } from "../../../utils/catchAsync.js";
import { POST_OFFSET } from "../../../utils/constants.js";

export const getAllTaggedPostsController = catchAsync(async (req, res) => {
  const { hashtagId } = req.params;
  const { offset } = req.query;

  const result = await getAllTaggedPosts({
    hashtagId,
    offset,
  });

  if (result.length <= 0) {
    return res.status(200).send({
      message: "No posts found",
      posts: [],
    });
  }

  return res.status(200).send({
    message: "Found tagged posts",
    posts:result,
    offset: Number(offset) + POST_OFFSET,
  });
});
