import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import convertControllers from "../../controller/converter/index.js"
const router = Router();
const {markDownToHTMLController} = convertControllers;
router.post("/convert/markdowntohtml",requireAuth,markDownToHTMLController);

export default router;
