import { getAllUserPosts } from "../../../model/Posts/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { POST_OFFSET } from "../../../utils/constants.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const getAllUserPostsController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { offset, sort } = req.query;

  const formattedOffset = parseInt(offset);
  const formattedUserId = parseInt(userId);

  const sortOptionList = {
    asc: "asc",
    desc: "desc",
    name: "name",
  };

  const sortOption = sortOptionList[sort];
  if (
    !isPositiveInteger(formattedOffset) ||
    !isPositiveInteger(formattedUserId)
  ) {
    return next(new AppError(`offset,userId needs to be numbers`, 400));
  }

  if (!userId) {
    return next(new AppError(`userId is not present`, 400));
  }
  if (!sortOption) {
    return next(
      new AppError(`Pleae provide correct sort option. asc, desc, name.`, 400)
    );
  }

  const result = await getAllUserPosts({ userId, offset, sortBy: sort });

  if (result.length <= 0) {
    return res.status(200).send({
      message: `No post found.`,
      posts: [],
    });
  }

  const formattedPosts = result.map((post) => {
    return {
      postId: post.id,
      title: post.title,
      createdAt: post.created_at,
      imgURL: post.title_img_url,
      likes: post.post_analytics?.likes,
      comments: post.post_analytics?.comments,
    };
  });
  return res.status(200).send({
    message: `found user posts.`,
    posts: formattedPosts,

    offset: Number(offset) + POST_OFFSET,
  });
});
