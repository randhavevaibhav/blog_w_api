import { incript } from "../../../../utils/utils.js";
import {
  checkIfUserExistWithMail,
  createUser,
} from "../../../../model/Users/quries.js";
import { catchAsync } from "../../../../utils/catchAsync.js";
import { AppError } from "../../../../utils/appError.js";

export const singupController = catchAsync(async (req, res, next) => {
  const { firstName, email, password, registered_at } = req.body;

  if (!firstName || !email || !password || !registered_at) {
    return next(
      new AppError(
        `Please send alll required fields firstName, email, password, registered_at.`,
        400
      )
    );
  }

  if (password.length > 20 || password.length < 6) {
    return next(
      new AppError(
        `Password must have charaters greater than 6 and less than 20.`,
        400
      )
    );
  }

  const existingUser = await checkIfUserExistWithMail({ email });

  if (existingUser) {
    //409 code for existing user
    return next(new AppError(`User already exist. Please sign in.`, 409));
  }

  let incriptedPassword = await incript(password);
  const userData = { firstName, email, incriptedPassword, registered_at };
  const result = await createUser(userData);

  return res
    .status(201)
    .send({ message: `successfully created user with mail ${email}`, email });
});
