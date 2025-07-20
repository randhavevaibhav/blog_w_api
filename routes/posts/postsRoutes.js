import { Router } from "express";
import postControllers from "../../controller/posts/index.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { authPostActionsMiddleware } from "../../middleware/authPostActionsMiddleware.js";
import { cacheMiddleware } from "../../middleware/cacheMiddleware.js";

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
} = postControllers;
router.post("/post", requireAuth, createPostsController);
router.get("/user/posts/:userId", requireAuth, getAllUserPostsController);
router.get(
  "/following/posts/:userId",
  requireAuth,
  getAllFollowingUsersPostsController
);
router.get(
  "/post/:currentUserId?/:userId/:postId",
  cacheMiddleware(
    (req) => `user_posts:${req.params.userId}_${req.params.postId}`,
    300
  ),
  getIndividualPostController
);
router.get("/posts/all/:userId?", getAllPostsController);
router.get("/tag/:hashtagId", getAllTaggedPostsController);
router.get("/posts/search", getSearchedPostsController);
router.delete(
  "/post/delete/:userId/:postId",
  requireAuth,
  authPostActionsMiddleware,
  deletePostController
);
router.patch(
  "/post/edit",
  requireAuth,
  authPostActionsMiddleware,
  updatePostController
);
export default router;
