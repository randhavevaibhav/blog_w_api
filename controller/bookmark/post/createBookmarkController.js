import {
  checkIfAlreadyBookmarked,
  createBookmark,
} from "../../../model/Bookmark/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const createBookmarkController = catchAsync(async (req, res, next) => {
  const { userId, postId, createdAt } = req.body;

  if (!userId || !postId || !createdAt) {
    return next(
      new AppError(
        `please provide all required fields. ==>  userId, postId,createdAt`
      )
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
    createdAt
  });

  // console.log("createBookmark result ===> ", result);

  res.status(201).send({
    message: `successfully marked post as bookmark.`,
    bookmarked: true,
  });
});
