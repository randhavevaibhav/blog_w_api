import { Router } from "express";
import PostLikesControllers from "../../controller/postLikes/index.js"
import { requireAuth } from "../../middleware/authMiddleware.js";

const router = Router();
const {createPostLikeController,getTotalPostLikesController} = PostLikesControllers;
router.post("/createpostlike/:userId/:postId",requireAuth,createPostLikeController);

router.get("/gettotalpostlikes/:userId/:postId",requireAuth,getTotalPostLikesController);
export default router;