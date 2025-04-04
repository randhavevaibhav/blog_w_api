import bcrypt from "bcrypt";
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

    // console.log("user in sinIn_post ===> ", user);

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
          { userId: user.id, userName: user.first_name, userMail: user.email },
          process.env.REFRESH_TOKEN_SCERET,
          { expiresIn: "10h" }
        );
        //below options required to persist cookie on reload
        // sameSite:"none",
        // secure:true
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          maxAge: 10 * 60 * 60 * 1000,
          sameSite: "none",
          secure: true,
        });
        res.status(200).send({
          message: `user with mail: ${email} validated !!!`,
          userId: user.id,
          userName: user.first_name,
          userMail: user.email,
          accessToken,
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
    console.log("Error ocuured in signinController ==> ", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
