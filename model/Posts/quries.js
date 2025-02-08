import { Posts } from "./Posts.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

export const createPost = async (
  userId,
  title,
  content,
  createdAt,
  updatedAt = null,
  likes = null
) => {
  try {
    const result = await Posts.create({
      user_id:userId,
      title,
      content,
      created_at:createdAt,
      updated_at:updatedAt,
      likes,
    });

    return result;
  } catch (error) {
    console.log(
      `Error while creating a post ==> \n Error file location ===> :${__filename}`,
      error
    );
  }
};
