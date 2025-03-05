import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import commentsControllers from "../../controller/comments/index.js"
const router = Router();
const {createPostCommentController,getAllPostCommentsController} = commentsControllers;
router.post("/comment/:userId/:postId",requireAuth,createPostCommentController);
router.get("/comment/:postId",requireAuth,getAllPostCommentsController);
export default router;
