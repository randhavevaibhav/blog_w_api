import { createPost } from "../../../model/Posts/quries.js";


export const createPostsController = async (req,res)=>{
try {
    const {userId,title,content,createdAt,updatedAt=null,likes=null} = req.body;
    // console.log("{userId,title,content,createdAt,updatedAt,likes}",{userId,title,content,createdAt,updatedAt,likes})

    const result = await createPost(userId,title,content,createdAt,updatedAt,likes);

    res.status(201).send({
        message:`successfully created new post.`,
        postId:`${result.id}`
    })
     
} catch (error) {
    console.log("Error ocuured in createPostsController ==> ",error)
}

}