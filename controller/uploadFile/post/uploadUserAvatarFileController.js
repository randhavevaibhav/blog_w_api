import {
  supabaseFileUpload,
  supabaseGetFilePublicUrl,
} from "../../../utils/supabase.js";

import { catchAsync } from "../../../utils/catchAsync.js";
import { compressImage, getFileInfo } from "../../../utils/utils.js";

export const uploadUserAvatarFileController = catchAsync(
  async (req, res, next) => {
    const { file } = req;
    const bucket = `user-avatar`;
    if (!file) {
      return res.status(200).send({
        message: "No avatar image added !",
        fileURL: "",
      });
    }

    const { fileBuffer, mimetype, fileName } = getFileInfo({ file });

    const { compressedImageBuffer } = await compressImage({
      fileBuffer,
      mimetype,
    });
    //upload img

    const uploadImgFileRes = await supabaseFileUpload({
      bucket,
      fileName,
      compressedImageBuffer,
      mimetype,
    });

    //get public url of that img
    const { publicUrl } = await supabaseGetFilePublicUrl({
      bucket,
      fileName,
    });

    res.send({
      message: "avatar uploaded successfully!",
      fileURL: publicUrl,
    });
  }
);
