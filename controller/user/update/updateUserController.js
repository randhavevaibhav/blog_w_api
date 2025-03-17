import { updateUser } from "../../../model/Users/quries.js";

export const updateUserController = async(req,res)=>{
    try {
        const {userId} = req.params;
        const {userMail,userName} = req.body;
        if(!userId||!userMail||!userName)
        {
            return res.status(400).send({
                message:"Please send all required fields. userId,userName,userMail"
            })
        }

        const result = await updateUser(userId,userName,userMail);

        if(result[0]===0)
        {
            return res.sendStatus(304)
        }

        console.log("result of updateUser ===> ",result);

        return res.status(200).send({
            message:"user updated"
        })


        
    } catch (error) {
        console.log("Error ocurred in updateUserController ===> ",error);
        return res.satus(500).send({
            message:"Internal server error."
        })
    }
}