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
} = postControllers;
router.post("/createpost", requireAuth, createPostsController);
router.get("/posts/:userId", requireAuth, getAllOwnPostsController);
router.get("/post/:currentUserId?/:userId/:postId", getIndiviualPostController);
router.get("/getallposts", getAllPostsController);
router.delete(
  "/post/delete/:postId",
  requireAuth,
  authPostActionsMiddleware,
  deletePostController
);
router.patch(
  "/edit",
  requireAuth,
  authPostActionsMiddleware,
  updatePostController
);
export default router;
