import {
  checkIfAlreadyBookmarked,
  createBookmark,
} from "../../../model/Bookmark/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const createBookmarkController = catchAsync(async (req, res, next) => {
  const { userId, postId } = req.body;

  if (!userId || !postId) {
    return next(
      new AppError(`please provide all required fields. ==>  userId, postId`)
    );
  }

  const isAlreadyBookmarked = await checkIfAlreadyBookmarked({
    userId,
    postId,
  });

  if (isAlreadyBookmarked) {
    return res.sendStatus(304)
  }
  const result = await createBookmark({
    userId,
    postId,
  });

  // console.log("createBookmark result ===> ", result);

  res.status(201).send({
    message: `successfully marked post as bookmark.`,
  });
});
