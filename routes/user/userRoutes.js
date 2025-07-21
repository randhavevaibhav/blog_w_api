import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { adminMiddleware } from "../../middleware/adminMiddleware.js";
import userControllers from "../../controller/user/index.js";
import { cacheMiddleware } from "../../middleware/cacheMiddleware.js";
import { userRedisKeys } from "../../rediskeygen/user/userRedisKeys.js";

const router = Router();
const { getUserInfoRedisKey } = userRedisKeys();
const { updateUserController, getUserInfoController, getUserStatController } =
  userControllers;
router.patch(
  "/update/user",
  requireAuth,
  adminMiddleware,
  updateUserController
);
router.get(
  "/user/info/:currentUserId?/:userId",
  cacheMiddleware(
    (req) =>
      getUserInfoRedisKey({
        userId: req.params.userId,
      }),
    300
  ),
  getUserInfoController
);
router.get("/user/stat/:userId", getUserStatController);

export default router;
