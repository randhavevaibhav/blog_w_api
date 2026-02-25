
import { archivePost } from "../../../model/Posts/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const archivePostController = catchAsync(async (req, res) => {
  const { postId,archive} = req.body;
  const {userId} = req.user;
 const isArchived = parseInt(archive)===0;
  const result = await archivePost({
    postId,archive,userId
  })
 
  const message = isArchived?`post un-archived`:`post archived`
 
  res.status(200).send({
    postId,
    message,
  });
});
