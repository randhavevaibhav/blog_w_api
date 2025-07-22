import { createPostsController } from "./post/createPostsController.js";
import { getAllUserPostsController } from "./get/getAllUserPostsController.js";
import { getIndividualPostController } from "./get/getIndividualPostController.js";
import { deletePostController } from "./delete/deletePostController.js";
import { updatePostController } from "./update/updatePostController.js";
import { getAllPostsController } from "./get/getAllPostsController.js";
import { getSearchedPostsController } from "./get/getSearchedPostsController.js";
import { getAllFollowingUsersPostsController } from "./get/getAllFollowingUsersPostsController.js";
import { getAllTaggedPostsController } from "./get/getAllTaggedPostsController.js";
import { getPostAnalyticsController } from "./get/getPostAnalyticsController.js";
export default {
  createPostsController,
  getAllUserPostsController,
  getAllFollowingUsersPostsController,
  getIndividualPostController,
  getAllPostsController,
  deletePostController,
  updatePostController,
  getSearchedPostsController,
  getAllTaggedPostsController,
  getPostAnalyticsController,
};
