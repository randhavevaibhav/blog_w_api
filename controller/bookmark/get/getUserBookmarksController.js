import { getAllUserBookmarkedPosts } from "../../../model/Posts/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const getUserBookmarksController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { sort } = req.query;

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
