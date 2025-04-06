import { getTotalOwnCommentsCount } from "../../../model/PostComments/quiries.js";
import {
  getAllOwnPosts,
  getTotalOwnPostsLikesCount,
} from "../../../model/Posts/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const getAllOwnPostsController = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  if (!userId) {
    return next(new AppError(`userId is not present`, 400));
  }

  const result = await getAllOwnPosts(userId);

  // console.log("totalOwnPostsLikes =====> ",totalOwnPostsLikes)

  // console.log("totalOwnPostsComments =====> ",totalOwnPostsComments)

  // console.log("result2 ===========================>" ,result[0])
  // console.log("result from getAllPosts ==>  ",result)
  let responseData = null;
  // console.log("result.length ===> ",result.length)

  if (result[0].length) {
    const totalOwnPostsLikes = await getTotalOwnPostsLikesCount(userId);
    const totalOwnPostsComments = await getTotalOwnCommentsCount(userId);
    responseData = result[0].reduce((acc, rec) => {
      // console.log("rec from getAllOwnPosts ==>  ", rec);
      acc.push({
        id: rec.post_id,
        title: rec.title,
        content: rec.content,
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
      total_post_count: result[0].length,
      total_likes_count: totalOwnPostsLikes ? Number(totalOwnPostsLikes) : 0,
      total_post_comments: totalOwnPostsComments
        ? Number(totalOwnPostsComments)
        : 0,
    });
  } else {
    return res.status(404).send({
      message: `No post found.`,
      posts: 0,
      total_post_count: 0,
      total_likes_count: 0,
      total_post_comments: 0,
    });
  }
});
