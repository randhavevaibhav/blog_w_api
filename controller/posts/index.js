import { createPostsController } from "./post/createPostsController.js";
import { getAllUserPostsController } from "./get/getAllUserPostsController.js";
import { getIndiviualPostController } from "./get/getIndiviualPostController.js";
import { deletePostController } from "./delete/deletePostController.js";
import { updatePostController } from "./update/updatePostController.js";
import { getAllPostsController } from "./get/getAllPostsController.js";
import { getSearchedPostsController } from "./get/getSearchedPostsController.js";
import { getAllFollowingUsersPostsController } from "./get/getAllFollowingUsersPostsController.js";
export default {
  createPostsController,
  getAllUserPostsController,
  getAllFollowingUsersPostsController,
  getIndiviualPostController,
  getAllPostsController,
  deletePostController,
  updatePostController,
  getSearchedPostsController
};
