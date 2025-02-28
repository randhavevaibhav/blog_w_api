import { createPost } from "../../../model/Posts/quries.js";

export const createPostsController = async (req, res) => {
  try {
    const {
      userId,
      title,
      titleImgURL,
      content,
      createdAt,
      updatedAt ,
      likes ,
    } = req.body;
    // console.log("{userId,title,content,createdAt,updatedAt,likes}",{userId,title,content,createdAt,updatedAt,likes})
    if (!userId || !title || !content || !createdAt) {
      return res.status(400).send({
        message: `please provide all required fields. ==>  title, content`,
      });
    }

    const result = await createPost(
      userId,
      title,
      titleImgURL,
      content,
      createdAt,
      updatedAt,
      likes
    );

    res.status(201).send({
      message: `successfully created new post.`,
      postId: `${result.id}`,
    });
  } catch (error) {
    console.log("Error ocuured in createPostsController ==> ", error);
  }
};
