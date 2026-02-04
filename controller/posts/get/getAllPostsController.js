import { getAllPosts } from "../../../model/Posts/quires.js";

import { catchAsync } from "../../../utils/catchAsync.js";
import { POST_OFFSET } from "../../../utils/constants.js";

export const getAllPostsController = catchAsync(async (req, res, next) => {
  const { offset } = req.query;
  let result = [];
  if (req.user) {
    const { userId } = req.user;
    result = await getAllPosts({ offset, userId });
  } else {
    result = await getAllPosts({ offset, userId: null });
  }

  if (result.length <= 0) {
    return res.status(200).send({
      message: "No posts found",
      posts: [],
      total_posts_count: 0,
    });
  }

  const normalizedPosts = result.reduce((acc, post) => {
    acc = {
      ...acc,
      [`@${post.postId}`]: {
        ...post,
      },
    };
    return acc;
  }, {});

  return res.status(200).send({
    message: "found posts.",
    posts: normalizedPosts,
    total_posts_count: result.length,
    offset: Number(offset) + POST_OFFSET,
  });
});
