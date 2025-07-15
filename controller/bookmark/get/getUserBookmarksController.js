import { getUserBookmarks } from "../../../model/Bookmark/quires.js";
import { getAllPostHashtags } from "../../../model/PostHashtags/quires.js";
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

  const result = await getUserBookmarks({ userId, sort: sortOption });

  if (result.length == 0) {
    return res.status(404).send({
      message: `No bookmarks found.`,
      bookmarks: [],
    });
  }

  let postsWithTagsResult = null;
  let postsWithTags = [];

  postsWithTagsResult = result.map(async (posts) => {
    const tagList = await getAllPostHashtags({
      postId: posts.post_id,
    });

    return {
      ...posts,
      tagList,
    };
  });

  Promise.all(postsWithTagsResult)
    .then((result) => {
      postsWithTags = result;
      const formattedPosts = postsWithTags.map((post) => {
        return {
          userId: post.user_id,
          authorId: post.author_id,
          authorName: post.author_name,
          postId: post.post_id,
          titleImgURL: post.title_img_url,
          title: post.title,
          createdAt: post.created_at,
          profileImgURL: post.profile_img_url,
          likes:post.likes,
          comments:post.comments,
          tagList: post.tagList,
        };
      });
      return res.status(200).send({
        message: "Found Bookmarks",
        bookmarks: formattedPosts,
      });
    })
    .catch((err) => {
      return next(new AppError(`Error while getting tagged posts ${err}`, 400));
    });
});
