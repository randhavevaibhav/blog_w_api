import {
  supabaseFileUpload,
  supabaseGetFilePublicUrl,
} from "../../../utils/supabase.js";

import { catchAsync } from "../../../utils/catchAsync.js";
import { compressImage, getFileInfo } from "../../../utils/utils.js";

export const uploadPostTitleImgFileController = catchAsync(
  async (req, res, next) => {
    const { file } = req;
    const bucket = `post-title-imgs`;
    if (!file) {
      return res.status(200).send({
        message: "No post image added !",
        fileURL: "",
      });
    }

    const { fileBuffer, mimetype, fileExt, fileSize } = getFileInfo({ file });
    // console.log("mimetype ===> ", mimetype);

    let fileBufferToUpload = fileBuffer;

    const fileName = `${Date.now()}_post_title_img_${fileExt}`;

    if (fileSize > 200000) {
      if (mimetype !== `image/webp`) {
        const { compressedImageBuffer } = await compressImage({
          fileBuffer,
          mimetype,
        });
        fileBufferToUpload = compressedImageBuffer;
      }
    }

    // console.log("fileBufferToUpload ==> ", fileBufferToUpload);
    //upload img

    const uploadImgFileRes = await supabaseFileUpload({
      bucket,
      fileName,
      fileBuffer: fileBufferToUpload,
      mimetype,
    });

    //get public url of that img
    const { publicUrl } = await supabaseGetFilePublicUrl({
      bucket,
      fileName,
    });

    res.send({
      message: "File uploaded successfully!",
      fileURL: publicUrl,
    });
  }
);
