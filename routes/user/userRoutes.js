import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { adminMiddleware } from "../../middleware/adminMiddleware.js";
import userControllers from "../../controller/user/index.js";
import { validateGetUserInfo, validateUpdateUser } from "../../middleware/fieldValidationMiddleware.js";
import {optionalAuthMiddleware} from "../../middleware/optionalAuthMiddleware.js"
const router = Router();

const { updateUserController, getUserInfoController } =
  userControllers;
router.patch(
  "/update/user",
  requireAuth,
  //admin middleware for PROD
  adminMiddleware,
  validateUpdateUser,
  updateUserController
);
router.get("/user/info/:userId",optionalAuthMiddleware,validateGetUserInfo, getUserInfoController);


export default router;
