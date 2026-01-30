import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import commentsControllers from "../../controller/comments/index.js";
import {
  validateCreateComment,
  validateDeleteComment,
  validateGetComment,
  validateUpdateComment,
} from "../../middleware/fieldValidationMiddleware.js";
import { optionalAuthMiddleware } from "../../middleware/optionalAuthMiddleware.js";
const router = Router();
const {
  createPostCommentController,
  deleteCommentController,
  getPostCommentsController,
  updateCommentController,
} = commentsControllers;

router.post(
  "/comment",
  requireAuth,
  validateCreateComment,
  createPostCommentController,
);
router.delete(
  "/comment/delete/:commentId/:postId/:hasReplies",
  requireAuth,
  validateDeleteComment,
  deleteCommentController,
);
router.patch(
  "/comment/update",
  requireAuth,
  validateUpdateComment,
  updateCommentController,
);
router.get(
  "/comments/:postId",
  optionalAuthMiddleware,
  validateGetComment,
  getPostCommentsController,
);
export default router;
