import { Router } from "express";
import bookmarkControllers from "../../controller/bookmark/index.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import {
  validateCreateBookmark,
  validateDeleteBookmark,
  validateGetUserBookmark,
} from "../../middleware/fieldValidationMiddleware.js";

const router = Router();
const {
  getUserBookmarksController,
  createBookmarkController,
  removeBookmarkController,
  getUserBookmarksTagsController,
} = bookmarkControllers;
router.get(
  "/bookmarks",
  requireAuth,
  validateGetUserBookmark,
  getUserBookmarksController,
);
router.get(
  "/bookmarks/tags",
  requireAuth,
  getUserBookmarksTagsController,
);
router.post(
  "/bookmarks",
  requireAuth,
  validateCreateBookmark,
  createBookmarkController,
);
router.delete(
  "/bookmarks/:postId",
  requireAuth,
  validateDeleteBookmark,
  removeBookmarkController,
);

export default router;
