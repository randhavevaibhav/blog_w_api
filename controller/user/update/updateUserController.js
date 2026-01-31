import {
  checkIfUserExistWithId,
  getUserWithEmail,
  updateUser,
} from "../../../model/Users/quires.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { encrypt } from "../../../utils/utils.js";
import bcrypt from "bcrypt";

export const updateUserController = catchAsync(async (req, res, next) => {
 
  const {
    userId,
    userMail,
    userName,
    password,
    profileImgUrl,
    oldPassword,
    userBio,
    userSkills,
    userWebsiteURL,
    userLocation,
  } = req.body;

  
  const isUserExist = await checkIfUserExistWithId({ userId });
  if (!isUserExist) {
    return next(
      new AppError(`user with mail:${email} not found!`, 400, {
        SessionTerminated: true,
      })
    );
  }

  const user = await getUserWithEmail({ email: userMail });

  // console.log("user in sinIn_post ===> ", user);

  const auth = await bcrypt.compare(oldPassword, user.dataValues.password_hash);

  if (!auth) {
    return next(new AppError(`Wrong password`, 403));
  }

  if (password.length > 20 || password.length < 6) {
    return next(
      new AppError(
        `Password must have characters greater than 6 and less than 20.`,
        400
      )
    );
  }
  const encryptedPassword = await encrypt(password);
  const updateUserData = {
    userId,
    userName,
    userMail,
    profileImgUrl,
    encryptedPassword,
    userBio,
    userSkills,
    userWebsiteURL,
    userLocation,
  };
  const result = await updateUser(updateUserData);

  if (result[0] === 0) {
    return res.sendStatus(304);
  }

  // console.log("result of updateUser ===> ",result);

  return res.status(200).send({
    message: "user updated",
  });
});
