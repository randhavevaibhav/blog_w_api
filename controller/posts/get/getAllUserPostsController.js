import { getAllUserPosts } from "../../../model/Posts/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { POST_OFFSET } from "../../../utils/constants.js";


export const getAllUserPostsController = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { offset, sort } = req.query;

  
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
