import { removeFollowerController } from "./delete/removeFollowerController.js";
import { getFollowersController } from "./get/getFollowersController.js";
import { getFollowingsController } from "./get/getFollowingsController.js";
import { createNewFollowerController } from "./post/createNewFollowerController.js";


export default {
  getFollowersController,
  getFollowingsController,
  removeFollowerController,
  createNewFollowerController
};