import { incCommentCount } from "../../../model/PostAnalytics/quries.js";
import { createPostComment } from "../../../model/PostComments/quiries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const createPostCommentController = catchAsync(
  async (req, res, next) => {
    // console.log("req.body ===> ", req.body);
    const { content, createdAt } = req.body;
    const userId = req.params.userId;
    const postId = req.params.postId;
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

    const result = await createPostComment(userId, postId, content, createdAt);
    const resultOfincCommentCount = await incCommentCount(postId);

    // console.log("resultOfincCommentCount ===> ",JSON.stringify(resultOfincCommentCount))

    return res.status(200).send({
      message: "submitted new comment",
    });
  }
);
