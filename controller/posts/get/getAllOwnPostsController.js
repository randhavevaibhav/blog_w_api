import { getAllOwnPosts } from "../../../model/Posts/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { POST_OFFSET } from "../../../utils/constants.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const getAllOwnPostsController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { offset, sort } = req.query;

  const formattedOffset = parseInt(offset);
  const formattedUserId = parseInt(userId);

  const sortOptionList = {
    asc: "asc",
    desc: "desc",
    name: "name",
  };

  const sortOption = sortOptionList[sort]
  if (!isPositiveInteger(formattedOffset)||!isPositiveInteger(formattedUserId)) {
    return next(new AppError(`offset,userId needs to be numbers`, 400));
  }

  if (!userId) {
    return next(new AppError(`userId is not present`, 400));
  }
  if(!sortOption)
  {
    return next(new AppError(`Pleae provide correct sort option. asc, desc, name.`, 400));
  }

 
 

  const result = await getAllOwnPosts({ userId, offset, sortBy: sort });

  let responseData = null;

  if (result.length > 0) {
    // console.log("totalOwnPostsCount ==> ",totalOwnPostsCount)
    responseData = result.reduce((acc, rec) => {
      // console.log("rec from getAllOwnPosts ==>  ", rec);
      acc.push({
        postId: rec.post_id,
        title: rec.title,
        createdAt: rec.created_at,
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
      posts: responseData,

      offset: Number(offset) + POST_OFFSET,
    });
  } else {
    return res.status(200).send({
      message: `No post found.`,
      posts: [],
    });
  }
});
