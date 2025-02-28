import { handleUpload } from "../../../utils/cloudinary.js";

export const uploadFileController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(200).send({
        message:"No post image added !",
        fileURL:""
      });
    }
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);

    res.send({
      message: "File uploaded successfully!",
      file: req.file.filename,
      fileURL: cldRes.url,
    });
  } catch (error) {
    console.log("Error ocuured in uploadFileController ==> ", error);
  }
};
