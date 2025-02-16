import { Router } from "express";
import { dashboardController } from "../../controller/dashboard/dashboardController.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/dashboard", requireAuth, dashboardController);

export default router;
