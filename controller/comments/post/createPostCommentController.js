import {createPostCommentTransaction } from "../../../model/PostComments/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";


export const createPostCommentController = catchAsync(
  async (req, res) => {
    const {userId} = req.user;
    const { postId, parentId = null, content, page = 0 } = req.body;

    const result = await createPostCommentTransaction({
      userId,
      postId,
      parentId,
      content,
    });

    return res.status(201).send({
      message: "submitted new comment",
      comment: {
        userId,
        commentId: result.id,
        content,
        createdAt:result.created_at,
        parentId: result.parent_id,
        likes: "0",
        page,
      },
    });
  },
);
