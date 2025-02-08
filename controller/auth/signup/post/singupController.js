import { JWT_MAX_AGE } from "../../../../utils/constants.js";
import { handleError } from "../../../../handleErrors/handleError.js";
import { createToken, incript } from "../../../../utils/utils.js";
import {
  checkIfUserExistWithMail,
  createUser,
} from "../../../../model/Users/quries.js";

export const singupController = async (req, res) => {
  try {
    const {
      firstName,
      email,
      password,
      registered_at,
    } = req.body;

    let incriptedPassword = "";
    if (password.length > 0) {
      incriptedPassword = await incript(password);
    }

    const existingUser = await checkIfUserExistWithMail(email);

    if (existingUser) {
      res.status(400).send({
        message: `user with mail ${email} already exist.`,
      });

      return;
    }

    const result = await createUser(
      firstName,
      email,
      incriptedPassword,
      registered_at
    );

    const token = createToken(result.id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: JWT_MAX_AGE * 1000 });

    res
      .status(201)
      .send({ message: `successfully created user with mail ${email}`, email });
  } catch (err) {
    console.log(err);
    const message = handleError(err);

    res.status(400).send({ message });
  }
};
