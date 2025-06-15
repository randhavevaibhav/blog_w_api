import { getAllOwnPosts } from "../../../model/Posts/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { POST_OFFSET } from "../../../utils/constants.js";

export const getAllOwnPostsController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { offset, sort } = req.query;

  if (!userId) {
    return next(new AppError(`userId is not present`, 400));
  }

  const result = await getAllOwnPosts({ userId, offset, sortBy: sort });

  let responseData = null;

  if (result[0].length) {
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

      offset: Number(offset) + POST_OFFSET,
    });
  } else {
    return res.status(200).send({
      message: `No post found.`,
      posts: `[]`,
    });
  }
});
