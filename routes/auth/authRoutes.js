import { Router } from "express";
import authControllers from "../../controller/auth/index.js";


const router = Router();
const {signinController,singupController,logoutController,terminateSessionController} = authControllers;

router.post("/signup",singupController);
router.post("/signin",signinController);
router.post("/terminate",terminateSessionController);
router.get("/logout",logoutController);

export default router;

