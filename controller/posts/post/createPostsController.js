import { createPostAnalytics } from "../../../model/PostAnalytics/quries.js";
import { createPost } from "../../../model/Posts/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";

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

  const result = await createPost(
    userId,
    title,
    titleImgURL,
    content,
    createdAt,
    updatedAt,
    likes
  );

  await createPostAnalytics(result.id);

  res.status(201).send({
    message: `successfully created new post.`,
    postId: `${result.id}`,
  });
});
