import { deletePostAnalytics } from "../../../model/PostAnalytics/quries.js";
import { deletePostComments } from "../../../model/PostComments/quiries.js";
import { removeAllPostLikes } from "../../../model/PostLikes/quries.js";
import { deletePost, getPost } from "../../../model/Posts/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { supabase } from "../../../index.js";

const getFilePathFromURL = (postTitleImgUrl) => {
  const urlArr = postTitleImgUrl.split("/");
  const urlArrLength = urlArr.length;
  const filePath = `${urlArr[urlArrLength - 1]}`;

  return filePath;
};

export const deletePostController = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;
  if (!postId) {
    return next(new AppError(`please send all required field postId`));
  }

  //get postTitleImgUrl
  const { title_img_url: postTitleImgUrl } = await getPost({ postId });
  // console.log("postTitleImgUrl ===>", postTitleImgUrl);

  if (postTitleImgUrl) {
    //get the file path
    const filePath = getFilePathFromURL(postTitleImgUrl);

    //delete from supabase storage

    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .remove([filePath]);

    if (error) {
      throw new Error(`Error while deleting file on supabase ==> ${error}`);
    }

    // console.log("Delted file ===> ",data)
  }

  //delete post
  const result = await deletePost({ postId });
  //delete all comments related to that post
  const deletePostCommentsResult = await deletePostComments({ postId });
  //delete post analytics
  await deletePostAnalytics({ postId });
  //delete post likes
  await removeAllPostLikes({ postId });

  //no post deleted
  if (result === 0) {
    return res.sendStatus(304);
  }

  //  console.log("result of deletepost query ===>", result);

  res.status(200).send({
    message: "post deleted !!",
    postId,
  });
});
