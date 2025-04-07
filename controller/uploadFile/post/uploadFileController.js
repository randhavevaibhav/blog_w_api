import { handleUpload } from "../../../utils/cloudinary.js";

import { Jimp } from "jimp";
export const uploadFileController = async (req, res) => {
  if (!req.file) {
    return res.status(200).send({
      message: "No post image added !",
      fileURL: "",
    });
  }

  const fileBuffer = req.file.buffer;
  const mimetype = req.file.mimetype;
  const fileName = req.file.filename;

  const image = await Jimp.read(fileBuffer);

  if (image.width > 900 && image.height > 600) {
    image.resize({
      w: 900,
      h: 600,
    }); // Adjust width as needed
  }

  // Compress and set quality

  const compressedImageBuffer = await image.getBuffer(mimetype);
  const b64 = Buffer.from(compressedImageBuffer).toString("base64");
  let dataURI = "data:" + mimetype + ";base64," + b64;
  const cldRes = await handleUpload(dataURI);

  res.send({
    message: "File uploaded successfully!",
    file: fileName,
    fileURL: cldRes.url,
  });
};
