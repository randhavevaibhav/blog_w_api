import { Router } from "express";
import postControllers from "../../controller/posts/index.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const router = Router();
const { createPostsController, getAllOwnPostsController ,getIndiviualPostController,getAllPostsController,deletePostController,updatePostController} = postControllers;
router.post("/createpost", requireAuth, createPostsController);
router.get("/posts/:userId", requireAuth, getAllOwnPostsController);
router.get("/posts/:userId/:postId", requireAuth, getIndiviualPostController);
router.get("/getallposts/:offset",requireAuth,getAllPostsController)
router.delete("/deletepost/:postId", requireAuth,deletePostController );
router.patch("/edit", requireAuth,updatePostController );
export default router;
