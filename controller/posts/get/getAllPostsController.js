import { getRecentComments } from "../../../model/PostComments/quires.js";
import { getAllPosts } from "../../../model/Posts/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { POST_OFFSET } from "../../../utils/constants.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const getAllPostsController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { offset } = req.query;
  const formattedOffset = parseInt(offset);
  const formattedUserId = parseInt(userId);

  if (!offset) {
    return next(new AppError(`userId,offset is not present`, 400));
  }

  if (!isPositiveInteger(formattedOffset)) {
    return next(new AppError(`offset needs to be number`, 400));
  }

  if (userId) {
    if (!isPositiveInteger(formattedUserId)) {
      return next(new AppError(`userId needs to be number`, 400));
    }
  }
  const result = await getAllPosts({ offset, userId });

  if (result.length <= 0) {
    return res.status(200).send({
      message: "No posts found",
      posts: [],
      total_posts_count: 0,
    });
  }

  const formattedPost = result.map((post) => {
    return {
      postId: post.id,
      firstName: post.users.first_name,
      profileImgURL: post.users.profile_img_url,
      titleImgURL: post.title_img_url,
      title: post.title,
      createdAt: post.created_at,
      likes: post.post_analytics?.likes,
      userId: post.users.id,
      totalComments: post.post_analytics?.comments,
      tagList: post.post_hashtags.map((val) => {
        return {
          id: val.hashtags.id,
          name: val.hashtags.name,
          info: val.hashtags.info,
          color: val.hashtags.color,
        };
      }),
      isBookmarked: post.bookmarks?.length ? true : false,
    };
  });

  let responseData = null;

  responseData = formattedPost.map(async (post) => {
    return {
      ...post,
      recentComments: await getRecentComments({
        postId: post.postId,
      }),
    };
  });

  await Promise.all(responseData)
    .then((result) => {
      // console.log("result ==> ",result)
      responseData = result.reduce((acc, rec) => {
        // console.log("rec from getAllOwnPosts ==>  ", rec);

        const formattedRecentComments = rec.recentComments.reduce(
          (acc, comment) => {
            acc.push({
              content: comment.content,
              postId: comment.post_id,
              userId: comment.users.user_id,
              createdAt: comment.created_at,
              firstName: comment.users.first_name,
              profileImgURL: comment.users.profile_img_url,
            });

            return acc;
          },
          []
        );

        acc.push({
          ...rec,
          recentComments: formattedRecentComments,
          page: parseInt(offset) / POST_OFFSET,
        });
        return acc;
      }, []);

      return res.status(200).send({
        message: "found posts. get all",
        posts: responseData,
        total_posts_count: responseData.length,
        offset: Number(offset) + POST_OFFSET,
      });
    })
    .catch((err) => {
      return next(new AppError(`Internal server error ===> ${err}`, 500));
    });
});
