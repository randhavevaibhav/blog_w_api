import { Router } from "express";
import hashtagsController from "../../controller/hashtags/index.js";

const router = Router();
const { getHashtagsController,getPopularHashtagsController } = hashtagsController;

router.get("/hashtags", getHashtagsController);
router.get("/popular/hashtags", getPopularHashtagsController);
export default router;
