import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { adminMiddleware } from "../../middleware/adminMiddleware.js";
import userControllers from "../../controller/user/index.js";

const router = Router();

const { updateUserController, getUserInfoController, getUserStatController } =
  userControllers;
router.patch(
  "/update/user",
  requireAuth,
  adminMiddleware,
  updateUserController
);
router.get("/user/info/:currentUserId?/:userId", getUserInfoController);
router.get("/user/stat/:userId", getUserStatController);

export default router;
