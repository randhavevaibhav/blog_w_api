import { getAllPosts } from "../../../model/Posts/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { POST_OFFSET } from "../../../utils/constants.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const getAllPostsController = catchAsync(async (req, res, next) => {
  const { offset } = req.query;
  const formattedOffset = parseInt(offset);

  if (!isPositiveInteger(formattedOffset)) {
    return next(new AppError(`offset needs to be number`, 400));
  }

  const result = await getAllPosts({ offset });

  let responseData = null;

  if (result.length) {
    responseData = result.reduce((acc, rec) => {
      // console.log("rec from getAllOwnPosts ==>  ", rec);
      acc.push({
        postId: rec.post_id,
        firstName: rec.first_name,
        profileImgURL: rec.profile_img_url,
        titleImgURL: rec.title_img_url,
        title: rec.title,
        createdAt: rec.created_at,
        likes: rec.likes ? rec.likes : 0,
        userId: rec.user_id,
        imgURL: rec.title_img_url,
        totalComments: rec.total_comments,
      });
      return acc;
    }, []);
    return res.status(200).send({
      message: "found posts. get all",
      posts: `${JSON.stringify(responseData)}`,
      total_posts_count: responseData.length,
      offset: Number(offset) + POST_OFFSET,
    });
  } else {
    return res.status(200).send({
      message: "No posts found",
      posts: `[]`,
      total_posts_count: 0,
    });
  }
});
