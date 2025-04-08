import { updateUser } from "../../../model/Users/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { incript } from "../../../utils/utils.js";

export const updateUserController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { userMail, userName, password } = req.body;
  if (!userId || !userMail || !userName || !password) {
    return next(
      new AppError(
        `Please send all required fields. userId,userName,userMail,password`
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
  const incriptedPassword = await incript(password);
  const updateUserData = {
    userId,
    userName,
    userMail,
    incriptedPassword,
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
