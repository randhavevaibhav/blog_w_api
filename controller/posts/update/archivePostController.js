import { archivePost } from "../../../model/Posts/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const archivePostController = catchAsync(async (req, res) => {
  const { postIds, archive } = req.body;
  const { userId } = req.user;
  const isArchived = parseInt(archive) === 0;
  const result = await archivePost({
    postIds,
    archive,
    userId,
  });
  const postsOrPost = postIds.length > 1 ? "posts" : "post";
  const message = isArchived
    ? `${postsOrPost} un-archived`
    : `${postsOrPost} archived`;

  res.status(200).send({
    message,
  });
});
