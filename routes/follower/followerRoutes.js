import { Router } from "express";
import followerControllers from "../../controller/follower/index.js";
import { requireAuth } from "../../middleware/authMiddleware.js";


const router = Router();
const { getFollowersController,getFollowingsController,createNewFollowerController,removeFollowerController} = followerControllers;
router.get("/followers/:userId",  getFollowersController);
router.get("/followings/:userId",  getFollowingsController);
router.post("/follower", requireAuth,createNewFollowerController);
router.delete("/follower/:userId/:followingUserId",requireAuth,removeFollowerController );

export default router;
