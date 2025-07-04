import { getUserBookmarks } from "../../../model/Bookmark/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const getUserBookmarksController = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const { sort } = req.query;

  const sortOptionList = {
    asc: "asc",
    desc: "desc",
  };

  const sortOption = sortOptionList[sort];
  if (!userId) {
    return next(new AppError(`userId is not present`, 400));
  }
  const formattedUserId = parseInt(userId);

  if (!isPositiveInteger(formattedUserId)) {
    return next(new AppError(`userId must be a number`,400));
  }

  if (!sortOption) {
    return next(
      new AppError(`Pleae provide correct sort option. asc, desc.`, 400)
    );
  }

  const result = await getUserBookmarks({ userId ,sort:sortOption});

  const formatedResult = result.map((bookmark) => {
    return {
      userId: bookmark.user_id,
      autherId: bookmark.auther_id,
      autherName: bookmark.auther_name,
      postId: bookmark.post_id,
      titleImgURL: bookmark.title_img_url,
      title: bookmark.title,
      createdAt: bookmark.created_at,
      profileImgURL: bookmark.profile_img_url,
    };
  });
  // console.log("formatedResult getUserBookmarksController ==> ", formatedResult);
  if (result.length == 0) {
    return res.status(404).send({
      message: `No bookmarks found.`,
      bookmarks: [],
    });
  }

  return res.status(200).send({
    message: "found bookmarks",
    bookmarks: formatedResult,
  });
});
