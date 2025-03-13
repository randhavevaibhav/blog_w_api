import { Router } from "express";
import PostLikesControllers from "../../controller/postLikes/index.js"
import { requireAuth } from "../../middleware/authMiddleware.js";
import {rateLimit} from "express-rate-limit";

const limiter = rateLimit({
  windowMs:  1000, // 1 sec
  limit: 3, // each IP can make up to 3 requests per `windowsMs` (1 sec)
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
  message:{
    message:"Too many requests"
  }
});
const router = Router();
const {getTotalPostLikesController,likePostController,dislikePostController} = PostLikesControllers;
router.post("/like/:userId/:postId",requireAuth,limiter,likePostController);
router.post("/dislike/:userId/:postId",requireAuth,limiter,dislikePostController);
router.get("/gettotalpostlikes/:userId/:postId",requireAuth,getTotalPostLikesController);
export default router;