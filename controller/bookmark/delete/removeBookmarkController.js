import { removeBookmark } from "../../../model/Bookmark/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const removeBookmarkController = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const postId = req.params.postId;

  if (!userId || !postId) {
    return next(
      new AppError(`please provide all required fields. ==>  userId, postId`)
    );
  }

  const formattedUserId = parseInt(userId);
  const formattedPostId = parseInt(postId);

  if(!isPositiveInteger(formattedUserId)||!isPositiveInteger(formattedPostId))
  {
    return next(
      new AppError(`userId, postId must be numbers`)
    );
  }
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
