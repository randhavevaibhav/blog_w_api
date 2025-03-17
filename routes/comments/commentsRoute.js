import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import commentsControllers from "../../controller/comments/index.js"
const router = Router();
const {createPostCommentController,getAllPostCommentsController,deleteCommentController} = commentsControllers;
router.post("/comment/:userId/:postId",requireAuth,createPostCommentController);
router.get("/comment/:postId",requireAuth,getAllPostCommentsController);
router.post("/comment/delete",requireAuth,deleteCommentController);
export default router;
