import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import commentsControllers from "../../controller/comments/index.js"
const router = Router();
const {createPostCommentController,getAllPostCommentsController,getAllOwnPostCommentsController} = commentsControllers;
router.post("/comment/:userId/:postId",requireAuth,createPostCommentController);
router.get("/comment/:postId",requireAuth,getAllPostCommentsController);
router.get("/getallcomments/:userId",requireAuth,getAllOwnPostCommentsController);
export default router;
