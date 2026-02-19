import { getUserBookmarksController } from "./get/getUserBookmarksController.js";
import { createBookmarkController } from "./post/createBookmarkController.js";
import { removeBookmarkController } from "./delete/removeBookmarkController.js";
import { getUserBookmarksTagsController } from "./get/getUserBookmarksTagsController.js";
export default {
  getUserBookmarksController,
  createBookmarkController,
  removeBookmarkController,
  getUserBookmarksTagsController
};