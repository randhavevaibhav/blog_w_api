import {
  getAllSearchedPostsHashtags,
} from "../../../model/Posts/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";


export const getSearchedPostsHashtagsController = catchAsync(async (req, res) => {
  const { query } = req.query;
  let allPostHashtags = [];
  let normalizedAllPostHashtags = {};


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
    message: "Found posts hashtags",
    allPostHashtags:normalizedAllPostHashtags,
  });
});
