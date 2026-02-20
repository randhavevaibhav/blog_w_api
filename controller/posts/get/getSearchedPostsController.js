import {
  getAllSearchedPosts,
} from "../../../model/Posts/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { SEARCH_POST_OFFSET } from "../../../utils/constants.js";

export const getSearchedPostsController = catchAsync(async (req, res) => {
  const { query, offset, sort, hashtag, limit = null } = req.query;

  const result = await getAllSearchedPosts({
    query,
    offset,
    sort,
    hashtag,
    limit,
  });

  if (result.length === 0) {
    return res.status(200).send({
      message: "No posts found",
      posts: [],
      allPostHashtags: [],
      totalPosts: 0,
    });
  }

  return res.status(200).send({
    message: "Found posts",
    posts: result,
    totalPosts: result.length,
    offset: Number(offset) + SEARCH_POST_OFFSET,
  });
});
