import { Router } from "express";
import postControllers from "../../controller/posts/index.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const router = Router();
const { createPostsController, getAllPostsController } = postControllers;
router.post("/createpost", requireAuth, createPostsController);
router.get("/posts/:userId", requireAuth, getAllPostsController);

export default router;
