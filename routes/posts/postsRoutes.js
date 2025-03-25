import { Router } from "express";
import postControllers from "../../controller/posts/index.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const router = Router();
const { createPostsController, getAllOwnPostsController ,getIndiviualPostController,getAllPostsController,deletePostController,updatePostController} = postControllers;
router.post("/createpost", requireAuth, createPostsController);
router.get("/posts/:userId", requireAuth, getAllOwnPostsController);
router.get("/post/:currentUserId/:userId/:postId", requireAuth, getIndiviualPostController);
router.get("/getallposts",requireAuth,getAllPostsController)
router.delete("/post/delete/:postId", requireAuth,deletePostController );
router.patch("/edit", requireAuth,updatePostController );
export default router;
