import { getAllSearchedPosts } from "../../../model/Posts/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { POST_OFFSET } from "../../../utils/constants.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const getSearchedPostsController = catchAsync(async (req, res, next) => {
  const { query, offset, sortby, limit } = req.query;
  const formattedOffset = parseInt(offset);
  const formattedLimit = parseInt(limit);

  
  const sortOptionList = {
    asc: "asc",
    desc: "desc",
  };
  const sortOption = sortOptionList[sortby];

  if (!query || !isPositiveInteger(formattedOffset)) {
    return next(new AppError(`please provide correct query,offset value`, 400));
  }

  if(limit)
  {
    if(!isPositiveInteger(formattedLimit))
    {
       return next(new AppError(`please provide correct limit value`, 400));
    }
  }
  
  if (!sortOption) {
    return next(
      new AppError(`please provide correct sort option. desc, asc.`, 400)
    );
  }

  const result = await getAllSearchedPosts({ query, offset, sort: sortOption,limit});

  let responseData = null;

  if (result.length) {
    responseData = result.reduce((acc, rec) => {
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
      message: "found posts",
      posts: responseData,
      totalPosts: responseData.length,
      offset: Number(offset) + POST_OFFSET,
    });
  } else {
    return res.status(200).send({
      message: "No posts found",
      posts: [],
      totalPosts: 0,
    });
  }
});
