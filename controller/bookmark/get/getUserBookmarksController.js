import {
  getUserBookmarks,
} from "../../../model/Bookmark/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const getUserBookmarksController = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  

 
  if (!userId) {
    return next(new AppError(`userId is not present`, 400));
  }

  const result = await getUserBookmarks({ userId });

  //   console.log("result getUserBookmarksController ==> ",result);

  if (result.length == 0) {
    return res.status(404).send({
      message: `No bookmarks found.`,
      bookmarks: [],
    });
  }

  return res.status(200).send({
    message: "found bookmarks",
    bookmarks: result
  });
});
