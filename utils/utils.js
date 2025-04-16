import bcrypt from "bcrypt";
import { Jimp } from "jimp";
import * as path from "path";
export const incript = async (item) => {
  const salt = await bcrypt.genSalt();
  const incripteditem = await bcrypt.hash(item, salt);
  return incripteditem;
};

export const compressImage = async({fileBuffer,mimetype})=>{
 
  const processedImage = await Jimp.read(fileBuffer);

  if (processedImage.width > 900 && processedImage.height > 600) {
      processedImage.resize({
      w: 900,
      h: 600,
    }); // Adjust width as needed
  }

  // Compress and set quality

  const compressedImageBuffer = await processedImage.getBuffer(mimetype);

  return {compressedImageBuffer};
}

export const getFileInfo=({file})=>{
  const fileBuffer = file.buffer;
  const mimetype = file.mimetype;
  const fileExt = path.extname(file.originalname);
  const fileName = `${Date.now()}_post_title_img_${fileExt}`;
  const bucket = file.bucket;


  return {
    fileBuffer,
    mimetype,
    fileExt,
    fileName,
    bucket
  }
}

