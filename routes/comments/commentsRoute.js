import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import commentsControllers from "../../controller/comments/index.js";
const router = Router();
const { createPostCommentController, deleteCommentController,getPostCommentsController } =
  commentsControllers;
router.post("/comment", requireAuth, createPostCommentController);
router.post("/comment/delete", requireAuth, deleteCommentController);
router.get("/comments/:currentUserId?/:postId", getPostCommentsController);
export default router;
