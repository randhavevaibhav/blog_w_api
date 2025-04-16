import { Router } from "express";
import uploadFileControllers from "../../controller/uploadFile/index.js";
import { upload } from "../../utils/multer.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const router = Router();
const {uploadPostTitleImgFileController} = uploadFileControllers;
router.post(
  "/upload/title-img",
  requireAuth,
  upload.single("post_title_img_file"),
  uploadPostTitleImgFileController
);

export default router;
