import { handleError } from "../../../../handleErrors/handleError.js";
import { incript } from "../../../../utils/utils.js";
import {
  checkIfUserExistWithMail,
  createUser,
} from "../../../../model/Users/quries.js";

export const singupController = async (req, res) => {
  try {
    const { firstName, email, password, registered_at } = req.body;

    let incriptedPassword = "";
    if (password.length > 0) {
      incriptedPassword = await incript(password);
    }

    const existingUser = await checkIfUserExistWithMail(email);

    if (existingUser) {
      //409 code for existing user
      res.status(409).send({
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

    res
      .status(201)
      .send({ message: `successfully created user with mail ${email}`, email });
  } catch (err) {
    console.log(err);
    const message = handleError(err);

    res.status(400).send({ message });
  }
};
