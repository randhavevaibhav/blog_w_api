import { Router } from "express";
import PostLikesControllers from "../../controller/postLikes/index.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const router = Router();
const { likePostController, dislikePostController } = PostLikesControllers;
router.post("/post/like", requireAuth, likePostController);
router.post("/post/dislike", requireAuth, dislikePostController);
export default router;
