import { Router } from "express";
import authControllers from "../../controller/auth/index.js";


const router = Router();
const {signinController,signupController,logoutController,terminateSessionController} = authControllers;

router.post("/signup",signupController);
router.post("/signin",signinController);
router.post("/terminate",terminateSessionController);
router.get("/logout",logoutController);

export default router;

