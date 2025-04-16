import { Router } from "express";
import uploadFileControllers from "../../controller/uploadFile/index.js";
import { upload } from "../../utils/multer.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const router = Router();
const { uploadPostTitleImgFileController, uploadUserProfileImgController } =
  uploadFileControllers;
router.post(
  "/upload/title-img",
  requireAuth,
  upload.single("post_title_img_file"),
  uploadPostTitleImgFileController
);

//no require auth as user is at sign up stage
router.post(
  "/upload/profile-img",
  upload.single("user_profile_img_file"),
  uploadUserProfileImgController
);

export default router;
