import { Router } from "express";
import postControllers from "../../controller/posts/index.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { authPostActionsMiddleware } from "../../middleware/authPostActionsMiddleware.js";
import { cacheMiddleware } from "../../middleware/cacheMiddleware.js";
import { postsRedisKeys } from "../../rediskeygen/posts/postsRedisKeys.js";

const { getIndividualPostRedisKey } = postsRedisKeys();
const router = Router();
const {
  createPostsController,
  getAllUserPostsController,
  getAllFollowingUsersPostsController,
  getIndividualPostController,
  getAllPostsController,
  deletePostController,
  updatePostController,
  getSearchedPostsController,
  getAllTaggedPostsController,
  getPostAnalyticsController,
} = postControllers;
router.post("/post", requireAuth, createPostsController);
router.get("/user/posts/:userId", requireAuth, getAllUserPostsController);
router.get(
  "/following/posts/:userId",
  requireAuth,
  getAllFollowingUsersPostsController
);
// router.get(
//   "/post/:currentUserId?/:userId/:postId",
//   cacheMiddleware(
//     (req) =>
//       getIndividualPostRedisKey({
//         postId: req.params.postId,
//       }),
//     300
//   ),
//   getIndividualPostController
// );

router.get(
  "/post/:userId/:postId",
  cacheMiddleware(
    (req) =>
      getIndividualPostRedisKey({
        postId: req.params.postId,
      }),
    300
  ),
  getIndividualPostController
);
router.get("/posts/all/:userId?", getAllPostsController);
router.get("/tag/:hashtagId", getAllTaggedPostsController);
router.get("/posts/search", getSearchedPostsController);
router.get(
  "/post/analytics/:currentUserId?/:userId/:postId",
  getPostAnalyticsController
);
router.delete(
  "/post/delete/:userId/:postId",
  requireAuth,
  authPostActionsMiddleware,
  deletePostController
);
router.patch(
  "/post/edit",
  requireAuth,
  authPostActionsMiddleware,
  updatePostController
);
export default router;
