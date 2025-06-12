import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { adminMiddleware } from "../../middleware/adminMiddleware.js";
import userControllers from "../../controller/user/index.js"

const router = Router();
const {updateUserController,getUserInfoController} = userControllers;
router.patch("/update/user",requireAuth,adminMiddleware,updateUserController)
router.get("/user/:userId",getUserInfoController)

export default router;