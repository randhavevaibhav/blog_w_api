import {
  getUserBookmarks,
} from "../../../model/Bookmark/quires.js";
import { getPostAnalytics } from "../../../model/PostAnalytics/quires.js";
import { getAllPostHashtags } from "../../../model/PostHashtags/quires.js";
import { getUserInfo } from "../../../model/Users/quires.js";
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

  const bookmarksRes = await getUserBookmarks({
    userId,
    sort,
  });

  if (bookmarksRes.length == 0) {
    return res.status(404).send({
      message: `No bookmarks found.`,
      bookmarks: [],
    });
  }

  const formattedBkmRes = bookmarksRes.map(async (bookmark) => {
    return {
      userId: bookmark.posts.user_id,
      postId: bookmark.posts.id,
      titleImgURL: bookmark.posts.title_img_url,
      title: bookmark.posts.title,
      createdAt: bookmark.posts.created_at,
      postAnalytics: {
        ...(await getPostAnalytics({
          postId: bookmark.posts.id,
        })),
      },
      userInfo: {
        ...(await getUserInfo({
          userId: bookmark.posts.user_id,
        })),
      },
      tagList: {
        ...(await getAllPostHashtags({
          postId: bookmark.posts.id,
        })),
      },
    };
  });

  Promise.all(formattedBkmRes)
    .then((posts) => {
      const formattedPosts = posts.map((post) => {
        // console.log("post.tagList.dataValues.tagList ==>",post.tagList)
        return {
          userId,
          authorId: post.userId,
          postId: post.postId,
          titleImgURL: post.titleImgURL,
          title: post.title,
          createdAt: post.createdAt,
          authorName: post.userInfo.dataValues.first_name,
          profileImgURL: post.userInfo.dataValues.profile_img_url,
          comments: post.postAnalytics.dataValues.comments,
          likes: post.postAnalytics.dataValues.likes,
          tagList: Object.values(post.tagList),
        };
      });
      // console.log("formattedPosts ===> ", formattedPosts);

      return res.status(200).send({
        message: "Found Bookmarks",
        bookmarks: formattedPosts,
      });
    })
    .catch((err) => {
      return next(new AppError(`Error while bookmarked posts ${err}`, 400));
    });
});
