import { createPostsController } from "./post/createPostsController.js";
import { getAllOwnPostsController } from "./get/getAllOwnPostsController.js";
import { getIndiviualPostController } from "./get/getIndiviualPostController.js";
import { deletePostController } from "./delete/deletePostController.js";
import { updatePostController } from "./update/updatePostController.js";
import { getAllPostsController } from "./get/getAllPostsController.js";
export default {
  createPostsController,
  getAllOwnPostsController,
  getIndiviualPostController,
  getAllPostsController,
  deletePostController,
  updatePostController
};
