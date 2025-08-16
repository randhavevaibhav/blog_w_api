import { createCommentAnalytics } from "../../../model/CommentAnalytics/quires.js";
import { createPostComment } from "../../../model/PostComments/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const createPostCommentController = catchAsync(
  async (req, res, next) => {
    // console.log("req.body ===> ", req.body);
    const {
      userId,
      postId,
      parentId = null,
      content,
      createdAt,
      page = 0,
    } = req.body;

    // console.log("postId,content,createdAt,likes ===> ", postId);

    // console.log("userId  createPostCommentController ===> ",userId)
    // console.log("postId  createPostCommentController ===> ",postId)

    if (!userId || !postId || !content || !createdAt) {
      return next(
        new AppError(
          `Please send all required fields.userId, postId,content,createdAt`
        )
      );
    }

    const formattedUserId = parseInt(userId);
    const formattedPostId = parseInt(postId);

    if (
      !isPositiveInteger(formattedUserId) ||
      !isPositiveInteger(formattedPostId)
    ) {
      return next(new AppError(`userId, postId must be numbers`));
    }

    const commentData = { userId, postId, content, createdAt, parentId };
    const result = await createPostComment(commentData);

    const createCommentAnalyticsRes = await createCommentAnalytics({
      commentId: result.id,
    });

    return res.status(200).send({
      message: "submitted new comment",
      comment: {
        userId,
        commentId: result.id,
        content,
        createdAt,
        parentId: result.parent_id,
        likes: "0",
        page,
      },
    });
  }
);
