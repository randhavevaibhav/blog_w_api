import { getAllFollowingUsersPosts } from "../../../model/Posts/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { POST_OFFSET } from "../../../utils/constants.js";

export const getAllFollowingUsersPostsController = catchAsync(
  async (req, res) => {
    const { userId } = req.user;
    const { offset } = req.query;

    const result = await getAllFollowingUsersPosts({ userId, offset });

    if (result.length <= 0) {
      return res.status(200).send({
        message: "No following user posts found",
        posts: [],
        total_posts_count: 0,
      });
    }

    const normalizedPosts = result.reduce((acc, post) => {
      acc = {
        ...acc,
        [`@${post.postId}`]: {
          ...post,
        },
      };
      return acc;
    }, {});

    return res.status(200).send({
      message: "found following user posts.",
      posts: normalizedPosts,
      total_posts_count: result.length,
      offset: Number(offset) + POST_OFFSET,
    });
  }
);
