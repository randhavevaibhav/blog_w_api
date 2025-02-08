import { Users } from "./users.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
export const createUser=async(firstName,email,incriptedPassword,registered_at)=>{
   
    try {
         const result = await Users.create({
              first_name: firstName,
              email,
              password_hash: incriptedPassword,
              registered_at,
            });

        return result;
        
    } catch (error) {
        console.log(`Error while creating a User ==> \n Error file location ===> :${__filename}`,error)
    }
}

export const checkIfUserExistWithMail = async (email) => {
    try {
        const user = await Users.findOne({ where: { email: email } });
  
        return user;
        
    } catch (error) {
        console.log(`Error while checking if user exist with mail ==> \n file location ===> :${__filename}`,error)
    }
   
  };

  export const checkIfUserExistWithId = async (id) => {
    try {
        const user = await Users.findOne({ where: { id: id } });
  
        return user;
        
    } catch (error) {
        console.log(`Error while checking if user exist with id==> \n file location ===> :${__filename}`,error)
    }
   
  };