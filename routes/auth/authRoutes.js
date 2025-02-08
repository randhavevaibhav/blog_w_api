import { Router } from "express";
import authControllers from "../../controller/auth/index.js";


const router = Router();
const {signinController,singupController,logoutController} = authControllers;
router.post("/signup",singupController);
router.post("/signin",signinController);
router.get("/logout",logoutController);

export default router;

