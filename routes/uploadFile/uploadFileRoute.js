import { Router } from "express";
import { uploadFileController } from "../../controller/uploadFile/post/uploadFileController.js";
import { upload } from "../../utils/multer.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const router = Router();

router.post(
  "/upload",
  requireAuth,
  upload.single("file"),
  uploadFileController
);

export default router;
