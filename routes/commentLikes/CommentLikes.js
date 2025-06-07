import { Router } from "express";
import CommentLikesControllers from "../../controller/commentLikes/index.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1000, // 1 sec
  limit: 7, // each IP can make up to 7 requests per `windowsMs` (1 sec)
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
  message: {
    message: "Too many requests",
  },
});
const router = Router();
const { likeCommentController, dislikeCommentController } =
  CommentLikesControllers;
router.post("/comment/like", requireAuth, limiter, likeCommentController);
router.post("/comment/dislike", requireAuth, limiter, dislikeCommentController);
export default router;
