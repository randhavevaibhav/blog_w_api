import { getAllPostHashtags } from "../../../model/PostHashtags/quires.js";
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

  let responseData = null;

  if (result.length === 0) {
    return res.status(200).send({
      message: "No posts found",
      posts: [],
      totalPosts: 0,
    });
  }

  let postsWithTagsResult = null;
  let postsWithTags = [];

  postsWithTagsResult = result.map(async (posts) => {
    const tagList = await getAllPostHashtags({
      postId: posts.post_id,
    });

    return {
      ...posts,
      tagList,
    };
  });

  Promise.all(postsWithTagsResult)
    .then((result) => {
      postsWithTags = result;
      const formattedPosts = postsWithTags.map((post) => {
        return {
          postId: post.post_id,
          firstName: post.first_name,
          profileImgURL: post.profile_img_url,
          titleImgURL: post.title_img_url,
          title: post.title,
          createdAt: post.created_at,
          likes: post.likes ? post.likes : 0,
          userId: post.user_id,
          imgURL: post.title_img_url,
          totalComments: post.total_comments,
          tagList: post.tagList,
          offset: Number(offset) + POST_OFFSET,
        };
      });
      return res.status(200).send({
        message: "Found posts",
        posts: formattedPosts,
        totalPosts: formattedPosts.length,
      });
    })
    .catch((err) => {
      return next(new AppError(`Error while getting tagged posts ${err}`, 400));
    });
});
