import { Router } from "express";
import postControllers from "../../controller/posts/index.js"
import {requireAuth} from "../../middleware/authMiddleware.js"

const router = Router();
const {createPostsController} = postControllers;
router.post("/posts",requireAuth,createPostsController);


export default router;
