import { createPostTransaction } from "../../../model/Posts/quires.js";
import { getTotalUserPosts } from "../../../model/Users/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const createPostsController = catchAsync(async (req, res, next) => {
  const { title, titleImgURL, content, tagList } = req.body;
  const { userId } = req.user;

  const totalUserPostsResult = await getTotalUserPosts({ userId });
  let totalUserPosts = totalUserPostsResult.dataValues.posts;

  const adminUsers = process.env.ADMIN_USERID.split(",").map(Number);

  const isAdmin = adminUsers.includes(userId);

  if (totalUserPosts >= 20 && !isAdmin) {
    return next(
      new AppError(`Can not create more posts. Post limit reached !!`)
    );
  }

  const { createPostResult } = await createPostTransaction({
    userId,
    title,
    titleImgURL,
    content,
    tagList,
    archive: 0,
  });

  const postId = createPostResult.id;

  res.status(201).send({
    message: `successfully created new post.`,
    postId,
  });
});
