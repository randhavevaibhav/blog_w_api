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
  validateGetPostAnalytics,
  validateGetSearchedPosts,
  validateUpdatePost,
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
  getPostAnalyticsController,
} = postControllers;

router.post("/post", requireAuth, validateCreatePost, createPostsController);
router.get(
  "/user/posts",
  requireAuth,
  validateGetAllUserPosts,
  getAllUserPostsController
);
router.get(
  "/following/posts",
  requireAuth,
  validateGetAllFollowingUserPosts,
  getAllFollowingUsersPostsController
);

router.get(
  "/post/:postId",
  validateGetIndividualPost,
  getIndividualPostController
);
router.get(
  "/posts/all",
  optionalAuthMiddleware,
  validateGetAllPosts,
  getAllPostsController
);
router.get(
  "/tag/:hashtagId/:hashtagName",
  validateGetAllTaggedPosts,
  getAllTaggedPostsController
);
router.get(
  "/posts/search",
  requireAuth,
  validateGetSearchedPosts,
  getSearchedPostsController
);
router.get(
  "/post/analytics/:userId/:postId",
  optionalAuthMiddleware,
  validateGetPostAnalytics,
  getPostAnalyticsController
);
router.delete(
  "/post/delete/:postId",
  requireAuth,
  validateDeletePost,
  deletePostController
);
router.patch(
  "/post/edit",
  requireAuth,
  validateUpdatePost,
  updatePostController
);
export default router;
