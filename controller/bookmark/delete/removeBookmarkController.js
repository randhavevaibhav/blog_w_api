import { removeBookmark } from "../../../model/Bookmark/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";


export const removeBookmarkController = catchAsync(async (req, res) => {
   const { userId } = req.user;
  const postId = req.params.postId;

  const result = await removeBookmark({
    userId,
    postId,
  });

  // console.log("removeBookmark result ===> ", result);
  if (result == 0) {
    return res.status(200).send({
      message: `already removed from bookmarked !`,
      bookmarked: false,
    });
  }

  return res.status(200).send({
    message: `successfully removed bookmark.`,
    bookmarked: false,
  });
});
