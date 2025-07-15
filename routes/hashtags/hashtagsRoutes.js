import { Router } from "express";
import hashtagsController from "../../controller/hashtags/index.js";

const router = Router();
const { getHashtagsController } = hashtagsController;

router.get("/hashtags", getHashtagsController);

export default router;
