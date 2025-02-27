import { Router } from "express";
import postControllers from "../../controller/posts/index.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const router = Router();
const { createPostsController, getAllPostsController ,getIndiviualPostController} = postControllers;
router.post("/createpost", requireAuth, createPostsController);
router.get("/posts/:userId", requireAuth, getAllPostsController);
router.get("/posts/:userId/:postId", requireAuth, getIndiviualPostController);
export default router;
