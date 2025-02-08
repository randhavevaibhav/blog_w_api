import jwt from "jsonwebtoken"
import { JWT_SECRET_KEY } from "../utils/constants.js";

export const requireAuth = (req,res,next)=>{
   try {

console.log("req.cookies ===> ",req.cookies)
    if(!req.cookies)
    {
        res.status(400).send({
            message:`this is a protected route. cookies are required!`
        });

        return;
    }

    const token = req.cookies.jwt;

 

    if(token)
    {
        jwt.verify(token,JWT_SECRET_KEY,(err,decodedToken)=>{
            if(err)
            {
                console.log("Error in JWT token ==> ",err);
                console.log("redirecting to login page");
                res.redirect("/login")
            }else{
                console.log("Auth successfull");
                console.log("decodedToken ===> ",decodedToken);
                next()
            }
        })

    }
    else{
        console.log("redirecting to login page")
        res.status(400).send({
            message:`Error JWT auth failed.`
        })
    }
   } catch (error) {
    console.log("error occured in requireAuth",error);
  
   }
}


