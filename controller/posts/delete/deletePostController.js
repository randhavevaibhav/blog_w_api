import { deletePost } from "../../../model/Posts/quries.js";

export const deletePostController = async (req, res) => {
  try {
    const postId = req.params.postId;
    if ( !postId) {
      return res.status(400).send({
        message: "please send all required field postId",
      });
    }

    const result = await deletePost( postId);
    //no post deleted
    if (result === 0) {
    
      return res.sendStatus(304);
    }

    //  console.log("result of deletepost query ===>", result);

    res.status(200).send({
      message: "post deleted !!",
      postId
    });
  } catch (error) {
    console.log("Error ocuured in deletePostController ===> ", error);
  }
};
