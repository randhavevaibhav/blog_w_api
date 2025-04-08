import { supabase } from "../../../index.js";
import { Jimp } from "jimp";
import * as path from "path";

import { catchAsync } from "../../../utils/catchAsync.js";
export const uploadFileController = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(200).send({
      message: "No post image added !",
      fileURL: "",
    });
  }
 
  const fileBuffer = req.file.buffer;
  const mimetype = req.file.mimetype;
  const fileExt = path.extname(req.file.originalname);
  const fileName = `${Date.now()}_post_title_img_${fileExt}`;
  const filePath = `${fileName}`;
  const image = await Jimp.read(fileBuffer);

  if (image.width > 900 && image.height > 600) {
    image.resize({
      w: 900,
      h: 600,
    }); // Adjust width as needed
  }

  // Compress and set quality

  const compressedImageBuffer = await image.getBuffer(mimetype);
  //upload img
  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .upload(filePath, compressedImageBuffer, {
      contentType: mimetype,
    });

  if (error) {
    throw new Error(`Error while uploading file to supabase! ==> ${error}`);
  }

  //get public url of that img
  const { data: publicUrlData } = supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .getPublicUrl(filePath);

  const imageUrl = publicUrlData.publicUrl;

  res.send({
    message: "File uploaded successfully!",
    file: fileName,

    fileURL: imageUrl,
  });
});
