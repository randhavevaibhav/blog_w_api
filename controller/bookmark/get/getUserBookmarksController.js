import { getAllUserBookmarkedPosts } from "../../../model/Posts/quires.js";
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
    return next(new AppError(`userId must be a number`, 400));
  }

  if (!sortOption) {
    return next(
      new AppError(`Please provide correct sort option. asc, desc.`, 400)
    );
  }

  const bookmarkPostsResult = await getAllUserBookmarkedPosts({ userId, sort });

  if (bookmarkPostsResult.length <= 0) {
    return res.status(404).send({
      message: `No bookmarks found.`,
      bookmarks: [],
    });
  }

  const formattedPosts = bookmarkPostsResult.map((post) => {
    return {
      userId,
      authorId: post.user_id,
      postId: post.id,
      titleImgURL: post.title_img_url,
      title: post.title,
      createdAt: post.created_at,
      authorName: post.users.first_name,
      profileImgURL: post.users.profile_img_url,
      comments: post.post_analytics?.comments,
      likes: post.post_analytics?.likes,
      tagList: post.post_hashtags.map((val) => {
        return {
          id: val.hashtags.id,
          name: val.hashtags.name,
          info: val.hashtags.info,
          color: val.hashtags.color,
        };
      }),
    };
  });

  return res.status(200).send({
    message: "Found Bookmarks",
    bookmarks: formattedPosts,
  });
});
