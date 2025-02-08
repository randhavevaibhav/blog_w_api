import { getAllPostsWithUserId } from "../../../model/Posts/quries.js";
import { checkIfUserExistWithId } from "../../../model/Users/quries.js";


export const getAllPostsController = async (req,res)=>{
try {
    const {userId} = req.body;

    const userExist = await checkIfUserExistWithId(userId);
    if(!userExist)
    {
        res.status(400).send({
            message:`Error can not create post!! user with ${userId} does not exist.`
        });

        return;
    }
    const result = await getAllPostsWithUserId(userId);
    console.log("getAllPostsWithUserId result ===> ",result)

    res.status(200).send({
        message:`Retrive all posts successfully.`,
    })
     
} catch (error) {
    console.log("Error ocuured in getAllPostsController ==> ",error)
}

}