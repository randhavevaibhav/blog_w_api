import { getAllPostHashtags } from "../../../model/PostHashtags/quires.js";
import {
  getAllTaggedPosts,
} from "../../../model/Posts/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { POST_OFFSET } from "../../../utils/constants.js";


export const getAllTaggedPostsController = catchAsync(
  async (req, res, next) => {
    const { hashtagId, hashtagName } = req.params;
    const { offset } = req.query;

    const result = await getAllTaggedPosts({
      hashtagId,
      hashtagName,
      offset,
    });

    if (result.length <= 0) {
      return res.status(200).send({
        message: "No posts found",
        posts: [],
      });
    }

    const formattedPosts = result.map((post) => {
      return {
        postId: post.id,
        userId: post.user_id,
        firstName: post.users.first_name,
        profileImgURL: post.users.profile_img_url,
        titleImgURL: post.title_img_url,
        title: post.title,
        createdAt: post.created_at,
        likes: post.post_analytics.likes,
        comments: post.post_analytics.comments,
      };
    });

    // console.log("formattedPosts  ==>> ", formattedPosts);

    let postsWithTagsResult = null;
    postsWithTagsResult = formattedPosts.map(async (post) => {
      const tagList = await getAllPostHashtags({
        postId: post.postId,
      });
      return {
        ...post,
        tagList,
      };
    });

    Promise.all(postsWithTagsResult)
      .then((posts) => {
        return res.status(200).send({
          message: "Found tagged posts",
          posts,
          offset: Number(offset) + POST_OFFSET,
        });
      })
      .catch((err) => {
        return next(
          new AppError(`Error while getting tagged posts ${err}`, 400)
        );
      });

    
  }
);
