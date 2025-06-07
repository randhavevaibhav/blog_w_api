import { createCommentAnalytics } from "../../../model/CommentAnalytics/quries.js";
import { incCommentCount } from "../../../model/PostAnalytics/quries.js";
import { createPostComment } from "../../../model/PostComments/quiries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const createPostCommentController = catchAsync(
  async (req, res, next) => {
    // console.log("req.body ===> ", req.body);
    const { userId, postId, parentId = null, content, createdAt } = req.body;

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

    const commentData = { userId, postId, content, createdAt, parentId };
    const result = await createPostComment(commentData);

    const resultOfincCommentCount = await incCommentCount(postId);

    const createCommentAnalyticsRes = await createCommentAnalytics({
      commentId: result.id,
    });

    // console.log("resultOfincCommentCount ===> ",JSON.stringify(resultOfincCommentCount))

    return res.status(200).send({
      message: "submitted new comment",
      comment: {
        userId,
        id: result.id,
        content,
        created_at: createdAt,
        parentId: result.parent_id,
      },
    });
  }
);
