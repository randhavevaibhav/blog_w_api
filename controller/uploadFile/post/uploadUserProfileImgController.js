import {
  supabaseFileUpload,
  supabaseGetFilePublicUrl,
} from "../../../utils/supabase.js";

import { catchAsync } from "../../../utils/catchAsync.js";
import { compressImage, getFileInfo } from "../../../utils/utils.js";

export const uploadUserProfileImgController = catchAsync(
  async (req, res, next) => {
    const { file } = req;
    const bucket = `user-profile-img`;
    if (!file) {
      return res.status(200).send({
        message: "No profile image added !",
        fileURL: "",
      });
    }

    const { fileBuffer, mimetype, fileExt, fileSize } = getFileInfo({ file });

    let fileBufferToUpload = fileBuffer;

    const fileName = `${Date.now()}_user_profile_img_${fileExt}`;

    if (fileSize > 200000) {
      const { compressedImageBuffer } = await compressImage({
        fileBuffer,
        mimetype,
        isProfileImg: true,
        w: 320,
        h: 320,
      });

      fileBufferToUpload = compressedImageBuffer;
    }

    //upload img

    const uploadImgFileRes = await supabaseFileUpload({
      bucket,
      fileName,
      fileBuffer: fileBufferToUpload,
      mimetype,
    });

    // console.log("uploadImgFileRes ====> ",uploadImgFileRes)

    //get public url of that img
    const { publicUrl } = await supabaseGetFilePublicUrl({
      bucket,
      fileName,
    });

    res.send({
      message: "profile img uploaded successfully!",
      fileURL: publicUrl,
    });
  }
);
