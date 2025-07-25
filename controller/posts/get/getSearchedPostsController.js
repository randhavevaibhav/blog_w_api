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

  if (limit) {
    if (!isPositiveInteger(formattedLimit)) {
      return next(new AppError(`please provide correct limit value`, 400));
    }
  }

  if (!sortOption) {
    return next(
      new AppError(`please provide correct sort option. desc, asc.`, 400)
    );
  }

  const result = await getAllSearchedPosts({
    query,
    offset,
    sort: sortOption,
    limit,
  });

  if (result.length <= 0) {
    return res.status(200).send({
      message: "No posts found",
      posts: [],
      totalPosts: 0,
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
      likes: post.post_analytics.likes,
      userId: post.users.id,
      totalComments: post.post_analytics.comments,
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
 
  if (result.length === 0) {
    return res.status(200).send({
      message: "No posts found",
      posts: [],
      totalPosts: 0,
    });
  }

  return res.status(200).send({
    message: "Found posts",
    posts: formattedPost,
    totalPosts: formattedPost.length,
    offset: Number(offset) + POST_OFFSET,
  });
});
