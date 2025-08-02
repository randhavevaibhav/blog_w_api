import bcrypt from "bcrypt";
import { Jimp } from "jimp";
import * as path from "path";
export const encrypt = async (item) => {
  const salt = await bcrypt.genSalt();
  const encryptedItem = await bcrypt.hash(item, salt);
  return encryptedItem;
};

export const compressImage = async ({
  fileBuffer,
  mimetype,
  isProfileImg = false,
  w = 900,
  h = 600,
}) => {
  let processedImage = await Jimp.read(fileBuffer);

  // console.log("processedImage ===> ",processedImage)
  if (!isProfileImg) {
    if (processedImage.width > 900 && processedImage.height > 600) {
      processedImage = processedImage.resize({
        w,
        h,
      }); // Adjust width as needed

      // console.log("compressing !");
    }
  } else {
    processedImage = processedImage.resize({
      w: 60,
      h: 60,
    });
  }

  processedImage = await processedImage.getBuffer(mimetype);

  return { compressedImageBuffer: processedImage };
};

export const getFileInfo = ({ file }) => {
  const fileBuffer = file.buffer;
  const mimetype = file.mimetype;
  const fileExt = path.extname(file.originalname);
  const fileSize = file.size;

  const bucket = file.bucket;
  // console.log("File Info ==> ", file);
  return {
    fileBuffer,
    mimetype,
    fileExt,
    bucket,
    fileSize,
  };
};

export const isPositiveInteger = (num) => {
  return typeof num === "number" && Number.isInteger(num) && num >= 0;
};
