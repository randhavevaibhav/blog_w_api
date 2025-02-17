import bcrypt from "bcrypt";

import { JWT_MAX_AGE } from "../../../../utils/constants.js";
import { checkIfUserExistWithMail } from "../../../../model/Users/quries.js";
import jwt from "jsonwebtoken";
export const signinController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({
        message: `email or password is missing`,
      });
      return;
    }

    // const user = await checkIfUserExistWithMail(email);
    const user = await checkIfUserExistWithMail(email);

    // console.log("user in sinIn_post ===> ", user.id);

    if (!user) {
      //404 code for user not found
      res.status(404).send({
        message: `user with mail:${email} not found!`,
      });
      return;
    }

    if (user) {
      //IMP first arg to bcrypt.compare should be password entered by user then hash version of pass stored in db othervise fails,.
      const auth = await bcrypt.compare(
        password,
        user.dataValues.password_hash
      );

      if (auth) {
        const accessToken = jwt.sign(
          { userId: user.id },
          process.env.ACCESS_TOKEN_SCERET,
          { expiresIn: "4m" }
        );
        const refreshToken = jwt.sign(
          { userId: user.id },
          process.env.REFRESH_TOKEN_SCERET,
          { expiresIn: "10h" }
        );

        // res.cookie("jwt", refreshToken, {
        //   httpOnly: true,
        //   maxAge: 10 * 60 * 60 * 1000,
        // });
        // res.status(200).send({
        //   message: `user with mail: ${email} validated !!!`,
        //   userId: user.id,
        //   accessToken,
        // });
      } else {
        res.status(400).send({
          message: `Invalid password`,
        });
      }
    }

    return res.status(200).send({
      message: "done",
    });
  } catch (error) {
    console.log("Error ocuured in sinIn_post ==> ", error);
  }
};
