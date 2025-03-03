import { updatePost } from "../../../model/Posts/quries.js";

export const updatePostController = async (req, res) => {
  try {
    const { postId, title, content, titleImgURL, updatedAt } = req.body;
    // console.log("postId, title, content, titleImgURL ,updatedAt =====>",postId, title, content, titleImgURL ,updatedAt)

    if (!postId || !title || !content || !updatedAt) {
      return res.status(400).send({
        message: "please send all required fields postId",
      });
    }

    const result = await updatePost(
      postId,
      title,
      content,
      titleImgURL,
      updatedAt
    );
    if (result[0] === 0) {
      return res.sendStatus(304);
    }
    // console.log("result in updatePostController ====> ",result);

    res.status(200).send({
      message: "post updated !!",
      postId,
    });
  } catch (error) {
    console.log("Error ocuured in updatePostController ===> ", error);
  }
};
