import { getAllOwnPosts } from "../../../model/Posts/quries.js";

export const getAllOwnPostsController = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (userId) {
      const result = await getAllOwnPosts(userId);

      // console.log("result2 ===========================>" ,result[0])
      // console.log("result from getAllPosts ==>  ",result)
      let responseData = null;
      // console.log("result.length ===> ",result.length)

      if (result[0].length) {
        responseData = result[0].reduce((acc, rec) => {
          // console.log("rec from getAllOwnPosts ==>  ", rec);
          acc.push({
            id: rec.post_id,
            title: rec.title,
            created_at: rec.created_at,
            likes: rec.likes,
            userId: rec.user_id,
            imgURL: rec.title_img_url,
            totalComments: rec.total_post_comments,
          });
          return acc;
        }, []);
        // console.log("responseData =======================> ", responseData);
        return res.status(200).send({
          message: `found user posts.`,
          posts: `${JSON.stringify(responseData)}`,
          total_post_count: result[0].length,
        });
      } else {
        return res.status(404).send({
          message: `No post found.`,
        });
      }
    } else {
      return res.status(400).send({
        message: `userId is not present`,
      });
    }
  } catch (error) {
    console.log("Error ocuured in getAllPostsController ==> ", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
