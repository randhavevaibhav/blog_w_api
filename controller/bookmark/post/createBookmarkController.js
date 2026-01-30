import {
  checkIfAlreadyBookmarked,
  createBookmark,
} from "../../../model/Bookmark/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const createBookmarkController = catchAsync(async (req, res) => {
  const {userId} = req.user;
  const { postId } = req.body;

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
    postId
  });

  // console.log("createBookmark result ===> ", result);

  res.status(201).send({
    message: `successfully marked post as bookmark.`,
    bookmarked: true,
  });
});
