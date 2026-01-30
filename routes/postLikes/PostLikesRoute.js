import { Router } from "express";
import PostLikesControllers from "../../controller/postLikes/index.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { validateLikeDisLikePost } from "../../middleware/fieldValidationMiddleware.js";

const router = Router();
const { likePostController, dislikePostController } = PostLikesControllers;
router.post("/post/like", requireAuth, validateLikeDisLikePost,likePostController);
router.post("/post/dislike", requireAuth,validateLikeDisLikePost, dislikePostController);
export default router;
