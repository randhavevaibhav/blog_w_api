import { getAllPosts } from "../../../model/Posts/quries.js";

export const getAllPostsController = async (req, res) => {
  try {
    const { limit } = req.body;

    if (!limit) {
      return res.status(400).send({
        message: "please send required field. limit",
      });
    }

    if (limit > 50) {
      return res.status(400).send({
        message: "limit can not exceed more than 50",
      });
    }

    const result = await getAllPosts(limit);

    if (result.length) {
      let responseData = null;

      responseData = result.reduce((acc, rec) => {
        // console.log("rec from getAllPostComments ==>  ", rec);
        acc.push({
          postId: rec.dataValues.id,
          userId: rec.dataValues.user_id,
          title: rec.dataValues.title,
          created_at: rec.dataValues.created_at,
          likes: rec.dataValues.likes,
        });
        return acc;
      }, []);

      // console.log("result getAllPostsController ===> ", result);

      return res.status(200).send({
        message: "found posts.",
        posts: `${JSON.stringify(responseData)}`,
        total_posts_count: result.length,
      });
    } else {
      return res.sendStatus(204);
    }
  } catch (error) {
    console.log("Error ocurred in getAllPostsController ===> ", error);
    return res.status(500).send({
      message: "Internal server error.",
    });
  }
};
