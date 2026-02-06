import { getAllBookmarkedPostsHashtags, getAllUserBookmarkedPosts } from "../../../model/Posts/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const getUserBookmarksController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { sort } = req.query;
  const { hashtagId } = req.query;
  
  const bookmarkPostsResult = await getAllUserBookmarkedPosts({
    userId,
    sort,
    hashtagId,
  });

  if (bookmarkPostsResult.length <= 0) {
    return res.status(404).send({
      message: `No bookmarks found.`,
      bookmarks: [],
    });
  }

   const allPostHashtags = await getAllBookmarkedPostsHashtags({
    userId
  })



  return res.status(200).send({
    message: "Found Bookmarks",
    bookmarks: bookmarkPostsResult,
    allPostHashtags,
  });
});
