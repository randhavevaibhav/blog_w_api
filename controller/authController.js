import { createToken, incript } from "../utils/utils.js";
import { JWT_MAX_AGE } from "../constants/constants.js";

import { handleError } from "../handleErrors/handleError.js";
import { Users } from "../model/users.js";

import bcrypt from "bcrypt";


const checkIfUserExist = async(email)=>{

const user = await Users.findOne({where:{email:email}});



return user;

}

const singUp_post = async (req, res) => {
  try {
    const { firstName,middleName=null,lastName=null, email, password, registered_at } =
      req.body;
    // console.log("password_hash.length ==>  ", password_hash.length);
    // console.log( firstName, mobile, email, password, registered_at)
    if (!password||password.length === 0) {
      res.status(400).send({ message: "password is missing" });
      return;
    }

    const existingUser = await checkIfUserExist(email);

    if(existingUser)
    {
       res.status(400).send({
        message:`user with mail ${email} already exist.`

      });

      return;
    }

    const incriptedPassword = await incript(password);

    const result = await Users.create({
      first_name:firstName,
      last_name:lastName,
      middle_name:middleName,
      email,
      password_hash: incriptedPassword,
      registered_at,
    });

    const token = createToken(result.id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: JWT_MAX_AGE * 1000 });

    res
      .status(201)
      .send({ message: `successfully created user with mail ${email}`,email });
  } catch (err) {
    console.log(err);
    const message = handleError(err);

    res.status(400).send({ message });
  }
};

const signIn_post = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({
        message: `email or password is missing`,
      });
      return;
    }

    const user = await Users.findOne({ where: { email } });

    console.log("user in sinIn_post ===> ", user.id);

    if (!user) {
      res.status(400).send({
        message: `user with mail:${email} not found!`,
      });
      return;
    }

    if (user) {
      //IMP first arg to bcrypt.compare should be password entered by user then hash version of pass stored in db othervise fails,.
      const auth = await bcrypt.compare( password,user.dataValues.password_hash);

      // console.log("auth ===> ",auth)
      if (auth) {
        const token = createToken(user.id);

        res.cookie("jwt", token, { httpOnly: true, maxAge: JWT_MAX_AGE * 1000 });
        res.status(200).send({
          message: `user with mail: ${email} validated !!!`,
          email
        });
        return;
      } else {
        res.status(400).send({
          message: `Invalid password`,
        });
        return;
      }
    }
  } catch (error) {
    console.log("Error ocuured in sinIn_post ==> ", error);
  }
};

const logout_get = (req,res)=>{
  
  res.cookie("jwt","",{maxAge:1});
  
  res.redirect("/")

  
 
}

export default {
  singUp_post,
  signIn_post,
  logout_get
};
