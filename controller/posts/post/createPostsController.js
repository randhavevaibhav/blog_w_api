import { createPost } from "../../../model/Posts/quries.js";
import { checkIfUserExistWithId } from "../../../model/Users/quries.js";

export const createPostsController = async (req,res)=>{
try {
    const {userId,title,content,createdAt,updatedAt=null,likes=null} = req.body;

    const userExist = await checkIfUserExistWithId(userId);
    if(!userExist)
    {
        res.status(400).send({
            message:`Error can not create post!! user with ${userId} does not exist.`
        });

        return;
    }
    const result = await createPost(userId,title,content,createdAt,updatedAt,likes);

    res.status(201).send({
        message:`successfully created new post.`,
        postId:`${result.id}`
    })
     
} catch (error) {
    console.log("Error ocuured in createPostsController ==> ",error)
}

}