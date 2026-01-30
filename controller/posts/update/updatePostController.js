import {  updatePostTransaction } from "../../../model/Posts/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const updatePostController = catchAsync(async (req, res) => {
  const { postId, title, content, titleImgURL, tagList } = req.body;
  const {userId} = req.user;

  const {updatePostResult} = await updatePostTransaction({
    title,
    content,
    titleImgURL,
    userId,
    postId,
    tagList
  })
 
  if (updatePostResult[0] === 0) {
    return res.sendStatus(304);
  }
 
  res.status(200).send({
    message: "post updated !!",
    postId,
  });
});
