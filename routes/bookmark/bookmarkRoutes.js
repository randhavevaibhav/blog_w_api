import { Router } from "express";
import bookmarkControllers from "../../controller/bookmark/index.js";
import { requireAuth } from "../../middleware/authMiddleware.js";


const router = Router();
const { getUserBookmarksController,createBookmarkController,removeBookmarkController} = bookmarkControllers;
router.get("/bookmarks/:userId", requireAuth, getUserBookmarksController);
router.post("/bookmarks", requireAuth, createBookmarkController);
router.delete("/bookmarks/:userId/:postId", requireAuth,removeBookmarkController );

export default router;
