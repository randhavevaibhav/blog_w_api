import { getAllPostHashtags } from "../../../model/PostHashtags/quires.js";
import { getAllTaggedPosts } from "../../../model/Posts/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { POST_OFFSET } from "../../../utils/constants.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const getAllTaggedPostsController = catchAsync(
  async (req, res, next) => {
    const { hashtagId } = req.params;
    const { offset } = req.query;

    if (!hashtagId || !offset) {
      return next(new AppError(`hashtagId or offset is not present`, 400));
    }
    const formattedHashtagId = parseInt(hashtagId);
    const formattedOffset = parseInt(offset);
    if (!isPositiveInteger(formattedHashtagId)) {
      return next(new AppError(`hashtagId must be a number`, 400));
    }
    if (!isPositiveInteger(formattedOffset)) {
      return next(new AppError(`offset must be a number`, 400));
    }

    const result = await getAllTaggedPosts({
      hashtagId,
      offset,
    });
    if (result.length > 0) {
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
          const formattedPostsWithTags = postsWithTags.map((post)=>{
            return {
                postId:post.post_id,
                hashtagId:post.hashtag_id,
                userId:post.user_id,
                firstName:post.first_name,
                profileImgURL:post.profile_img_url,
                titleImgURL:post.title_img_url,
                title:post.title,
                createdAt:post.created_at,
                likes:post.likes,
                comments:post.comments,
                tagList:post.tagList
            }
          })
          return res.status(200).send({
            message: "Found tagged posts",
            posts: formattedPostsWithTags,
            offset: Number(offset) + POST_OFFSET,
          });
        })
        .catch((err) => {
          return next(
            new AppError(`Error while getting tagged posts ${err}`, 400)
          );
        });
    } else {
      return res.status(200).send({
        message: "No posts found",
        posts: [],
      });
    }
  }
);
