import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import userControllers from "../../controller/user/index.js"

const router = Router();
const {updateUserController,getUserInfoController} = userControllers;
router.patch("/user/:userId",requireAuth,updateUserController)
router.get("/user/:userId",requireAuth,getUserInfoController)

export default router;