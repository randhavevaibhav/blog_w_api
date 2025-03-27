import { getAllPosts } from "../../../model/Posts/quries.js";
import { POST_OFFSET } from "../../../utils/constants.js";

export const getAllPostsController = async (req, res) => {
  try {
    const { offset } = req.query;

    // console.log("offset in getAllPostsController ===> ",offset)

    if (!offset) {
      return res.status(400).send({
        message: "please send required field. offset",
      });
    }

    const result = await getAllPosts(offset);

    if (result.length) {
      return res.status(200).send({
        message: "found posts. get all",
        posts: `${JSON.stringify(result)}`,
        total_posts_count: result.length,
        offset: Number(offset) + POST_OFFSET,
      });
    } else {
      return res.status(200).send({
        message: "No posts found",
        posts: `[]`,
        total_posts_count: 0,
      });
    }
  } catch (error) {
    console.log("Error ocurred in getAllPostsController ===> ", error);
    return res.status(500).send({
      message: "Internal server error.",
    });
  }
};
