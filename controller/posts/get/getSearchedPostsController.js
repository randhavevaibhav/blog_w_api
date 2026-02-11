import {
  getAllSearchedPosts,
  getAllSearchedPostsHashtags,
} from "../../../model/Posts/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { SEARCH_POST_OFFSET } from "../../../utils/constants.js";

export const getSearchedPostsController = catchAsync(async (req, res) => {
  const { query, offset, sort, hashtag } = req.query;
  let allPostHashtags = [];
  let normalizedAllPostHashtags = {};
  const result = await getAllSearchedPosts({
    query,
    offset,
    sort,
    hashtag,
  });

  if (result.length === 0) {
    return res.status(200).send({
      message: "No posts found",
      posts: [],
      allPostHashtags:[],
      totalPosts: 0,
    });
  }

  allPostHashtags = await getAllSearchedPostsHashtags({
    query,
  });

  if (allPostHashtags.length > 0) {
    normalizedAllPostHashtags = allPostHashtags.reduce((acc, tag) => {
      return {
        ...acc,
        [tag.id]: {
          ...tag,
        },
      };
    }, {});
  }

  return res.status(200).send({
    message: "Found posts",
    posts: result,
    allPostHashtags:normalizedAllPostHashtags,
    totalPosts: result.length,
    offset: Number(offset) + SEARCH_POST_OFFSET,
  });
});
