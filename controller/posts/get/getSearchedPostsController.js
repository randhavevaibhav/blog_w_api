import { getAllSearchedPosts } from "../../../model/Posts/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import {  SEARCH_POST_OFFSET } from "../../../utils/constants.js";


export const getSearchedPostsController = catchAsync(async (req, res) => {
  const { query, offset, sortby } = req.query;

  const result = await getAllSearchedPosts({
    query,
    offset,
    sort: sortby,
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
      likes: post.post_analytics?.likes,
      userId: post.users.id,
      totalComments: post.post_analytics?.comments,
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
    offset: Number(offset) + SEARCH_POST_OFFSET,
  });
});
