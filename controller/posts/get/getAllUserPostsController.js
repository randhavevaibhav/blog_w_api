import {
  getAllUserPosts,
  getArchiveUnArchivePostCount,
} from "../../../model/Posts/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { POST_OFFSET } from "../../../utils/constants.js";

export const getAllUserPostsController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { offset, sort, archive = 0 } = req.query;

  const result = await getAllUserPosts({
    userId,
    offset,
    sortBy: sort,
    archive,
  });

  const archiveResult = await getArchiveUnArchivePostCount({
    userId,
  });

  const { unarchivePosts, archivePosts } = archiveResult;

  if (result.length <= 0) {
    return res.status(200).send({
      message: `No post found.`,
      posts: [],
      unarchivePosts,
      archivePosts,
    });
  }

  return res.status(200).send({
    message: `found user posts.`,
    posts: result,
    unarchivePosts,
    archivePosts,
    offset: Number(offset) + POST_OFFSET,
  });
});
