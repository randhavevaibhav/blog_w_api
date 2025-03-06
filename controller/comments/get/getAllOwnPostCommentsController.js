import { getAllOwnPostComments } from "../../../model/PostComments/quiries.js";

export const getAllOwnPostCommentsController = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).send({
        message: "Please send all required fields. userId",
      });
    }

    const result = await getAllOwnPostComments(userId);

    // console.log(
    //   "result in getAllOwnPostCommentsController ===> ",
    //   result.length
    // );

    if (result.length) {
      const commentsData = result.reduce((acc, val) => {
        acc.push({
          id: val.id,
          content: val.content,
          userId: val.user_id,
          postId: val.post_id,
          createdAt: val.created_at,
          likes: val.likes,
        });

        return acc;
      }, []);

      //   console.log("commentsData ====> ", commentsData);

      return res.status(200).send({
        message: "fetched own comments",
        comments: JSON.stringify(commentsData),
        commentsCount: commentsData.length,
      });
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.log("Error ocuured in getAllOwnPostComments====>", error);

    return res.status(500).send({
      message: "Internal server error.",
    });
  }
};
