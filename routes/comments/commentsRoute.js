import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import commentsControllers from "../../controller/comments/index.js";
import { authCommentActionsMiddleware } from "../../middleware/authCommentActionsMiddleware.js";
const router = Router();
const { createPostCommentController, deleteCommentController,getPostCommentsController,updateCommentController } =
  commentsControllers;
router.post("/comment", requireAuth, createPostCommentController);
router.delete("/comment/delete/:commentId/:postId/:userId/:hasReplies", authCommentActionsMiddleware,requireAuth, deleteCommentController);
router.patch("/comment/update", authCommentActionsMiddleware,requireAuth, updateCommentController);
router.get("/comments/:currentUserId?/:postId", getPostCommentsController);
export default router;
