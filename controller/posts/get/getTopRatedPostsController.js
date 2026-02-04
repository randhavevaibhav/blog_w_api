import { getTopRatedPosts } from "../../../model/Posts/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const getTopRatedPostsController = catchAsync(
  async (req, res) => {
    const topLikedPosts = await getTopRatedPosts({
      target: "likes",
    });
    const topCommentedPosts = await getTopRatedPosts({
      target: "comments",
    });

    if(topLikedPosts.length<=0||topCommentedPosts.length<=0)
    {
       return res.status(404).send({
      message: "No posts found.",
      topLikedPosts:[],
      topCommentedPosts:[],
    });
    }

    return res.status(200).send({
      message: "found posts.",
      topLikedPosts,
      topCommentedPosts,
    });
  },
);
