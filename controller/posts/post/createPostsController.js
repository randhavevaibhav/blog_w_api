import { createPostAnalytics } from "../../../model/PostAnalytics/quires.js";
import { createPost } from "../../../model/Posts/quires.js";
import {
  getTotalUserPosts,
  incUserPostsCount,
} from "../../../model/Users/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const createPostsController = catchAsync(async (req, res, next) => {
  const { userId, title, titleImgURL, content, createdAt, updatedAt, likes } =
    req.body;
  // console.log("{userId,title,content,createdAt,updatedAt,likes}",{userId,title,content,createdAt,updatedAt,likes})
  if (!userId || !title || !content || !createdAt) {
    return next(
      new AppError(
        `please provide all required fields. ==>  title, content,user id, created at`
      )
    );
  }

  const formattedUserId = parseInt(userId);

  if (!isPositiveInteger(formattedUserId)) {
    return next(new AppError(`userId must be numbers`));
  }
  const totalUserPostsResult = await getTotalUserPosts({ userId });
  let totalUserPosts = totalUserPostsResult.dataValues.posts;

  if (totalUserPosts >= 20) {
    return next(
      new AppError(`Can not create more posts. Post limit reached !!`)
    );
  }

  const postData = {
    userId,
    title,
    titleImgURL,
    content,
    createdAt,
    updatedAt,
    likes,
  };
  const result = await createPost(postData);
  const postId = result.id;
  await createPostAnalytics({ postId });
  await incUserPostsCount({
    userId,
  });

  res.status(201).send({
    message: `successfully created new post.`,
    postId,
  });
});
