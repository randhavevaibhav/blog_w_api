import {
  checkIfAlreadyBookmarked,
  createBookmark,
} from "../../../model/Bookmark/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const createBookmarkController = catchAsync(async (req, res, next) => {
  const { userId, postId } = req.body;

  if (!userId || !postId) {
    return next(
      new AppError(`please provide all required fields. ==>  userId, postId`)
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

  const isAlreadyBookmarked = await checkIfAlreadyBookmarked({
    userId,
    postId,
  });

  if (isAlreadyBookmarked) {
    return res.status(200).send({
      message: "already bookmarked !",
      bookmarked: true,
    });
  }
  const result = await createBookmark({
    userId,
    postId,
  });

  // console.log("createBookmark result ===> ", result);

  res.status(201).send({
    message: `successfully marked post as bookmark.`,
    bookmarked: true,
  });
});
