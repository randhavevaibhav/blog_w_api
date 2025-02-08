import bcrypt from "bcrypt";
import { createToken } from "../../../../utils/utils.js";
import { JWT_MAX_AGE } from "../../../../utils/constants.js";
import { checkIfUserExistWithMail } from "../../../../model/Users/quries.js";
export const signinController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({
        message: `email or password is missing`,
      });
      return;
    }

    const user = await checkIfUserExistWithMail(email);

    // console.log("user in sinIn_post ===> ", user.id);

    if (!user) {
      res.status(400).send({
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
        const token = createToken(user.id);

        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: JWT_MAX_AGE * 1000,
        });
        res.status(200).send({
          message: `user with mail: ${email} validated !!!`,
          userId:user.id,
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
