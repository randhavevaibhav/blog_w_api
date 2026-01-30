import { updateComment } from "../../../model/PostComments/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";


export const updateCommentController = catchAsync(async(req, res, next) => {
  const { commentId, content } = req.body;
  const {userId} = req.user;

  const result = await updateComment({
    commentId,
    content,
    userId
  });

   return res.status(200).send({
       message: `comment updated successfully.`,
       commentId
     });
});
