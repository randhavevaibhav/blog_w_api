import { encrypt } from "../../../../utils/utils.js";
import {
  checkIfUserExistWithMail,
  createUser,
} from "../../../../model/Users/quires.js";
import { catchAsync } from "../../../../utils/catchAsync.js";
import { AppError } from "../../../../utils/appError.js";

export const signupController = catchAsync(async (req, res, next) => {

  return next(new AppError("new Signup's are disabled !!"))
  const { firstName, email, password, registered_at, profileImgUrl } = req.body;

  if (!firstName || !email || !password || !registered_at) {
    return next(
      new AppError(
        `Please send all required fields firstName, email, password, registered_at.`,
        400
      )
    );
  }

  if (password.length > 20 || password.length < 6) {
    return next(
      new AppError(
        `Password must have characters greater than 6 and less than 20.`,
        400
      )
    );
  }

  const existingUser = await checkIfUserExistWithMail({ email });

  if (existingUser) {
    //409 code for existing user
    return next(new AppError(`User already exist. Please sign in.`, 409));
  }

  let encryptedPassword = await encrypt(password);
  const userData = {
    firstName,
    email,
    encryptedPassword,
    registered_at,
    profileImgUrl,
  };
  const result = await createUser(userData);

  return res
    .status(201)
    .send({ message: `successfully created user with mail ${email}`, email });
});
