import {
  supabaseFileUpload,
  supabaseGetFilePublicUrl,
} from "../../../utils/supabase.js";

import { catchAsync } from "../../../utils/catchAsync.js";
import { compressImage, getFileInfo } from "../../../utils/utils.js";
import { AppError } from "../../../utils/appError.js";

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

    let compressedBuffer = "";
    const { fileBuffer, mimetype, fileExt } = getFileInfo({ file });
    console.log("mimetype ===> ", mimetype);

    const fileName = `${Date.now()}_post_title_img_${fileExt}`;

    compressedBuffer = fileBuffer;

    if (!mimetype === `image/webp`) {
      const { compressedImageBuffer } = await compressImage({
        fileBuffer,
        mimetype,
      });
      compressedBuffer = compressedImageBuffer;
    }

    //upload img

    const uploadImgFileRes = await supabaseFileUpload({
      bucket,
      fileName,
      compressedImageBuffer: compressedBuffer,
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
