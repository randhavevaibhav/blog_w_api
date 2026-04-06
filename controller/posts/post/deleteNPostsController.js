import {
  deleteNPostsTransaction,
  getAllNPosts,
} from "../../../model/Posts/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { supabaseDeleteStorageFile } from "../../../utils/supabase.js";

const getFilePathsFromURLS = (postTitleImgUrls) => {
  const filePaths = postTitleImgUrls.map((postTitleImgUrl) => {
    const urlArr = postTitleImgUrl.split("/");
    const urlArrLength = urlArr.length;
    const filePath = `${urlArr[urlArrLength - 1]}`;

    return filePath;
  });

  return filePaths;
};

export const deleteNPostsController = catchAsync(async (req, res, next) => {
  const bucket = `post-title-imgs`;

  const { userId } = req.user;
  const { postIds } = req.body;
  let filePaths = [];
 
  const posts = await getAllNPosts({ postIds, userId });

  const postTitleImgUrls = posts
    .filter((post) => {
      return post.titleImgURL && post.titleImgURL != "";
    })
    .map((post) => post.titleImgURL);

  if (postTitleImgUrls && postTitleImgUrls.length >= 1) {
    filePaths = getFilePathsFromURLS(postTitleImgUrls);
  }

  if (filePaths.length >= 1) {
    const { data, error } = await supabaseDeleteStorageFile({
      filePath: filePaths,
      bucket,
    });
    if (error) {
        return next(
            new AppError(`Error while deleting files on supabase`, 400, {
              error
            })
          );
     
    }
  }

  const { deleteNPostsResult } = deleteNPostsTransaction({
    userId,
    postIds,
  });

  //no post deleted
  if (deleteNPostsResult === 0) {
    return res.sendStatus(304);
  }

  res.status(200).send({
    message: "posts deleted !!",
  });
});
