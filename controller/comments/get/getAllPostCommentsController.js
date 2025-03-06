import { getAllPostComments } from "../../../model/PostComments/quiries.js";

export const getAllPostCommentsController = async (req, res) => {
  try {
    const postId = req.params.postId;

    if (!postId) {
      return res.status(400).send({
        message: "please send all required fields. postId",
      });
    }
    const result = await getAllPostComments(postId);

    if (result.length) {

      let responseData = null;

      responseData = result.reduce((acc, rec) => {
        // console.log("rec from getAllPostComments ==>  ", rec);
        acc.push({
          id: rec.dataValues.id,
          content: rec.dataValues.content,
          created_at: rec.dataValues.created_at,
          likes: rec.dataValues.likes,
          userName: rec.dataValues.users.dataValues.first_name,
        });
        return acc;
      }, []);

      // console.log("responseData from getAllPostComments ==>  ", responseData);

      return res.status(200).send({
        message: "found post comments.",
        comments: `${JSON.stringify(responseData)}`,
        total_comments_count:result.length
      });


    } else {
      return res.sendStatus(204)
    }

   
    
  } catch (error) {
    console.log("Error ocuured in getAllPostCommentsController", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
