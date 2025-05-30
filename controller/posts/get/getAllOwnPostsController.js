import { getTotalOwnPostCommentsCount } from "../../../model/PostComments/quiries.js";
import {
  getAllOwnPosts,
  getAllUserPosts,
  getTotalOwnPostsLikesCount,
} from "../../../model/Posts/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { POST_OFFSET } from "../../../utils/constants.js";

export const getAllOwnPostsController = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
   const { offset } = req.query;

  if (!userId) {
    return next(new AppError(`userId is not present`, 400));
  }

  const result = await getAllOwnPosts({ userId ,offset});

  // console.log("totalOwnPostsLikes =====> ",totalOwnPostsLikes)

  // console.log("totalOwnPostsComments =====> ",totalOwnPostsComments)

  // console.log("result2 ===========================>" ,result[0])
  // console.log("result from getAllPosts ==>  ",result)
  let responseData = null;
  // console.log("result.length ===> ",result.length)

  if (result[0].length) {
    const totalOwnPostsLikes = await getTotalOwnPostsLikesCount({ userId });
    const totalOwnPostsComments = await getTotalOwnPostCommentsCount({
      userId,
    });

    const totalOwnPosts = await getAllUserPosts({userId})
     const totalOwnPostsCount = totalOwnPosts.length;
    // console.log("totalOwnPostsCount ==> ",totalOwnPostsCount)
    responseData = result[0].reduce((acc, rec) => {
      // console.log("rec from getAllOwnPosts ==>  ", rec);
      acc.push({
        id: rec.post_id,
        title: rec.title,
        created_at: rec.created_at,
        likes: rec.likes ? rec.likes : 0,
        userId: rec.user_id,
        imgURL: rec.title_img_url,
        totalComments: rec.total_post_comments,
      });
      return acc;
    }, []);
    // console.log("responseData =======================> ", responseData);
    return res.status(200).send({
      message: `found user posts.`,
      posts: `${JSON.stringify(responseData)}`,
      total_post_count: totalOwnPostsCount,
      total_likes_count: totalOwnPostsLikes ? Number(totalOwnPostsLikes) : 0,
      total_post_comments: totalOwnPostsComments
        ? Number(totalOwnPostsComments)
        : 0,
      offset: Number(offset) + POST_OFFSET,
    });
  } else {
    return res.status(200).send({
      message: `No post found.`,
      posts: `[]`,
      total_post_count: 0,
      total_likes_count: 0,
      total_post_comments: 0,
    });
  }
});
