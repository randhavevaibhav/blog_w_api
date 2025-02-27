import { getPost } from "../../../model/Posts/quries.js";

export const getIndiviualPostController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const postId = req.params.postId;
    if (userId&&postId) {
      const result = await getPost(userId,postId);
      // console.log("result from getAllPosts ==>  ",result)
     const postData = {
        title:result.dataValues.title,
        content:result.dataValues.content,
        title_img_url:result.dataValues.title_img_url,
        likes:result.dataValues.likes,
        created_at:result.dataValues.created_at
     };

      if (result) {
        
        // console.log("indi post result ===> ",result)
        return res.status(200).send({
          message: `post fetched.`,
          postData
         
        });
      } else {
        return res.status(404).send({
          message: `No post found.`,
        });
      }
    } else {
      return res.status(400).send({
        message: `userId or postId is not present`,
      });
    }
  } catch (error) {
    console.log("Error ocuured in getAllPostsController ==> ", error);
  }
};
