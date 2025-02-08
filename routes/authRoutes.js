import { Router } from "express";
import authController from "../controller/authController.js";


const router = Router();

router.post("/signup",authController.singUp_post);
router.post("/signin",authController.signIn_post);
router.get("/logout",authController.logout_get);

export default router;

