import { checkIfAlreadyBookmarked } from "../../../model/Bookmark/quires.js";
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

  const result = await getAllPosts({ offset });

  let responseData = null;

  if (result.length) {
    responseData = result.map(async (post) => {
      return {
        ...post,
        recentComments: await getRecentComments({
          postId: post.post_id,
        }),
        isBookmarked: userId?await checkIfAlreadyBookmarked({
          userId: userId,
          postId: post.post_id,
        }):false,
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
                userId: comment.user_id,
                createdAt: comment.created_at,
                firstName: comment.first_name,
                profileImgURL: comment.profile_img_url,
              });

              return acc;
            },
            []
          );

          acc.push({
            postId: rec.post_id,
            firstName: rec.first_name,
            profileImgURL: rec.profile_img_url,
            titleImgURL: rec.title_img_url,
            title: rec.title,
            recentComments: formattedRecentComments,
            createdAt: rec.created_at,
            likes: rec.likes ? rec.likes : 0,
            userId: rec.user_id,
            imgURL: rec.title_img_url,
            totalComments: rec.total_comments,
            isBookmarked: rec.isBookmarked ? true : false,
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
  } else {
    return res.status(200).send({
      message: "No posts found",
      posts: [],
      total_posts_count: 0,
    });
  }
});
