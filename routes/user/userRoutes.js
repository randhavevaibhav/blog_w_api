import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import userControllers from "../../controller/user/index.js"

const router = Router();
const {updateUserController} = userControllers;
router.patch("/user/:userId",requireAuth,updateUserController)


export default router;