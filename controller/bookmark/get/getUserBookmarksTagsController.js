import {
  getAllBookmarkedPostsHashtags,
} from "../../../model/Posts/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const getUserBookmarksTagsController = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const allPostHashtags = await getAllBookmarkedPostsHashtags({
    userId,
  });

  if (allPostHashtags.length <= 0) {
    return res.status(404).send({
      message: `No bookmarks tags found.`,
      bookmarks: [],
    });
  }

  const normalizedPostHashtags = allPostHashtags.reduce((acc, tag) => {
    return {
      ...acc,
      [tag.id]: { ...tag },
    };
  }, {});

  return res.status(200).send({
    message: "Found Bookmarks tags",
    allPostHashtags: normalizedPostHashtags,
  });
});
