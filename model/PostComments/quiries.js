import { PostComments } from "./PostComments";

export const createPostComment = async (
  postId,
  content,
  createdAt,
  likes = null
) => {
  const result = await PostComments.create({
    post_id: postId,
    content,
    createdAt,
    likes,
  });

  return result;
};

