import { getAllPosts } from "../../../model/Posts/quries.js";

export const getAllPostsController = async (req, res) => {
  try {
    const {offset} = req.query;

    // console.log("offset in getAllPostsController ===> ",offset)

    if (!offset) {
      return res.status(400).send({
        message: "please send required field. offset",
      });
    }

    if (offset > 10) {
      return res.status(400).send({
        message: "offset can not exceed more than 10",
      });
    }

    const result = await getAllPosts(offset);

    if (result.length) {
      // console.log("result getAllPostsController ===> ", result);

      return res.status(200).send({
        message: "found posts. get all",
        posts: `${JSON.stringify(result)}`,
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
