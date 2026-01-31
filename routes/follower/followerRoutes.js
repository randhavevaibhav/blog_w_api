import { Router } from "express";
import followerControllers from "../../controller/follower/index.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import {
  validateCreateFollower,
  validateRemoveFollower,
  validateGetFollowersFollowings,
} from "../../middleware/fieldValidationMiddleware.js";

const router = Router();
const {
  getFollowersController,
  getFollowingsController,
  createNewFollowerController,
  removeFollowerController,
} = followerControllers;
router.get(
  "/followers",
  requireAuth,
  validateGetFollowersFollowings,
  getFollowersController,
);
router.get(
  "/followings",
  requireAuth,
  validateGetFollowersFollowings,
  getFollowingsController,
);
router.post(
  "/follower",
  requireAuth,
  validateCreateFollower,
  createNewFollowerController,
);
router.delete(
  "/follower/:followingUserId",
  requireAuth,
  validateRemoveFollower,
  removeFollowerController,
);

export default router;
