import { Router } from "express";
import postControllers from "../../controller/posts/index.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { optionalAuthMiddleware } from "../../middleware/optionalAuthMiddleware.js";
import {
  validateCreatePost,
  validateDeletePost,
  validateGetAllPosts,
  validateGetAllTaggedPosts,
  validateGetAllFollowingUserPosts,
  validateGetAllUserPosts,
  validateGetIndividualPost,
  validateGetSearchedPosts,
  validateUpdatePost,
  validateGetSearchedPostsHashtags,
} from "../../middleware/fieldValidationMiddleware.js";

const router = Router();
const {
  createPostsController,
  getAllUserPostsController,
  getAllFollowingUsersPostsController,
  getIndividualPostController,
  getAllPostsController,
  deletePostController,
  updatePostController,
  getSearchedPostsController,
  getAllTaggedPostsController,
  getTopRatedPostsController,
  getSearchedPostsHashtagsController,
} = postControllers;

router.post("/post", validateCreatePost, requireAuth, createPostsController);
router.get(
  "/user/posts",
  validateGetAllUserPosts,
  requireAuth,
  getAllUserPostsController,
);
router.get(
  "/following/posts",
  validateGetAllFollowingUserPosts,
  requireAuth,
  getAllFollowingUsersPostsController,
);

router.get(
  "/post/:postId",
  validateGetIndividualPost,
  optionalAuthMiddleware,
  getIndividualPostController,
);
router.get(
  "/posts/all",
  validateGetAllPosts,
  optionalAuthMiddleware,
  getAllPostsController,
);
router.get(
  "/tag/:hashtagId",
  validateGetAllTaggedPosts,
  getAllTaggedPostsController,
);

router.get(
  "/posts/search",
  validateGetSearchedPosts,
  getSearchedPostsController,
);

router.get(
  "/posts/search/hashtag",
  validateGetSearchedPostsHashtags,
  getSearchedPostsHashtagsController,
);

router.delete(
  "/post/delete/:postId",
  validateDeletePost,
  requireAuth,
  deletePostController,
);
router.patch(
  "/post/edit",
  validateUpdatePost,
  requireAuth,
  updatePostController,
);
router.get("/posts/top-rated", getTopRatedPostsController);
export default router;
