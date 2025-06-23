import { Router } from "express";
import postControllers from "../../controller/posts/index.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { authPostActionsMiddleware } from "../../middleware/authPostActionsMiddleware.js";

const router = Router();
const {
  createPostsController,
  getAllOwnPostsController,
  getIndiviualPostController,
  getAllPostsController,
  deletePostController,
  updatePostController,
getSearchedPostsController
} = postControllers;
router.post("/post", requireAuth, createPostsController);
router.get("/posts/own/:userId", requireAuth, getAllOwnPostsController);
router.get("/post/:currentUserId?/:userId/:postId", getIndiviualPostController);
router.get("/posts/all", getAllPostsController);
router.get("/posts/search",getSearchedPostsController);
router.delete(
  "/post/delete/:postId",
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
