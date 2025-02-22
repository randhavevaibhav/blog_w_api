import { getAllPosts } from "../../../model/Posts/quries.js";

export const getAllPostsController = async (req, res) => {
  try {
    const  userId  = req.params.userId;

    if (userId) {
      const result = await getAllPosts(userId);
      // console.log("result from getAllPosts ==>  ",result)
      let responseData = null;

      if (result.length) {
        responseData = result.reduce((acc, rec) => {
            console.log("rec from getAllPosts ==>  ",rec)
          acc.push({
            id:rec.dataValues.id,
            title:rec.dataValues.title,
            content: rec.dataValues.content,
            created_at:rec.dataValues.created_at,
            likes:rec.dataValues.likes,
            userId: rec.dataValues.users.dataValues.id,

          });
          return acc;
        }, []);

        return res.status(200).send({
          message: `found user posts.`,
          posts: `${JSON.stringify(responseData)}`,
        });
      } else {
        return res.status(404).send({
          message: `could not found posts with userId: ${userId}`,
        });
      }
    } else {
      return res.status(400).send({
        message: `userId is not present`,
      });
    }
  } catch (error) {
    console.log("Error ocuured in getAllPostsController ==> ", error);
  }
};
