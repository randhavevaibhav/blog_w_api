import { Router } from "express";
import { refreshTokenController } from "../../controller/refreshToken/refreshTokenController.js";

const router = Router();

// router.get("/refreshtoken/:userId", refreshTokenController);
router.get("/refresh", refreshTokenController);
export default router;
