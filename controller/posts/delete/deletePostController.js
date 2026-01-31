import {
  deletePostTransaction,
  getPost,
} from "../../../model/Posts/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { supabaseDeleteStorageFile } from "../../../utils/supabase.js";

const getFilePathFromURL = (postTitleImgUrl) => {
  const urlArr = postTitleImgUrl.split("/");
  const urlArrLength = urlArr.length;
  const filePath = `${urlArr[urlArrLength - 1]}`;

  return filePath;
};

export const deletePostController = catchAsync(async (req, res, next) => {
  const bucket = `post-title-imgs`;
  const postId = req.params.postId;
  const { userId } = req.user;

  //get postTitleImgUrl
  const { title_img_url: postTitleImgUrl } = await getPost({ postId });
  // console.log("postTitleImgUrl ===>", postTitleImgUrl);

  if (postTitleImgUrl) {
    //get the file path
    const filePath = getFilePathFromURL(postTitleImgUrl);

    //delete from supabase storage

    const { data, error } = await supabaseDeleteStorageFile({
      filePath,
      bucket,
    });

    if (error) {
      throw new Error(`Error while deleting file on supabase ==> ${error}`);
    }

    // console.log("Delted file ===> ",data)
  }

  const { deletePostResult } = deletePostTransaction({
    userId,
    postId,
  });

  //no post deleted
  if (deletePostResult === 0) {
    return res.sendStatus(304);
  }

  //  console.log("result of deletepost query ===>", result);

  res.status(200).send({
    message: "post deleted !!",
    postId,
  });
});
