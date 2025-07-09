import { updateComment } from "../../../model/PostComments/quiries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { isPositiveInteger } from "../../../utils/utils.js";

export const updateCommentController = catchAsync(async(req, res, next) => {
  const { commentId, content } = req.body;

  const formattedCommentId = parseInt(commentId);
  if (!content || !commentId) {
    return next(new AppError(`Please provide commentId,content`,400));
  }
  if (!isPositiveInteger(formattedCommentId)) {
    return next(new AppError(`commentId must be a number.`,400));
  }

  const result = await updateComment({
    commentId,
    content
  });

   return res.status(200).send({
       message: `comment updated successfully.`,
       commentId
     });
});
