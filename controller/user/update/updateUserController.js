import { checkIfUserExistWithMail, updateUser } from "../../../model/Users/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { incript } from "../../../utils/utils.js";
import bcrypt from "bcrypt";

export const updateUserController = catchAsync(async (req, res, next) => {
  //  return next(new AppError("updating user is disabled !!"))
  
  const { userId,userMail, userName, password, profileImgUrl, oldPassword,userBio,userSkills,userWebsiteURL,userLocation } = req.body;
  if (!userId || !userMail || !userName || !password || !oldPassword) {

    return next(
      new AppError(
        `Please send all required fields. userId,userName,userMail,oldPassword,password`
      )
    );
  }

  const user = await checkIfUserExistWithMail({ email: userMail });

  // console.log("user in sinIn_post ===> ", user);

  if (!user) {
    return next(new AppError(`user with mail:${userMail} not found!`, 400));
  }

  const auth = await bcrypt.compare(oldPassword, user.dataValues.password_hash);

  if (!auth) {
    return next(new AppError(`Wrong password`, 403));
  }

  if (password.length > 20 || password.length < 6) {
    return next(
      new AppError(
        `Password must have charaters greater than 6 and less than 20.`,
        400
      )
    );
  }
  const incriptedPassword = await incript(password);
  const updateUserData = {
    userId,
    userName,
    userMail,
    profileImgUrl,
    incriptedPassword,
    userBio,
    userSkills,
    userWebsiteURL,
    userLocation
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
