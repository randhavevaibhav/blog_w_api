import {
  createPostDoc,
  getAllFollowingUsersPostsDoc,
  getAllPostsDoc,
  getAllTaggedPostsDoc,
  getAllUserPostsDoc,
  getIndividualPostDoc,
  getSearchedPostsDoc,
  getTopRatedPostsDoc,
} from "./postRoutes.doc.js";

export const paths = {
  "/posts/all": {
    get: getAllPostsDoc,
  },
  "/post/{postId}": {
    get: getIndividualPostDoc,
  },
  "/posts/tag/{hashtagId}": { get: getAllTaggedPostsDoc },
  "/posts/search": { get: getSearchedPostsDoc },
  "/posts/top-rated": { get: getTopRatedPostsDoc },
  "/post": { post: createPostDoc },
  "/user/posts": { get: getAllUserPostsDoc },
  "/following/posts": { get: getAllFollowingUsersPostsDoc },
};
