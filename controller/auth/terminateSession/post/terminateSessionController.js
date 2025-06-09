import { checkIfUserExistWithMail, updateRefeshToken } from "../../../../model/Users/quries.js";
import { AppError } from "../../../../utils/appError.js";
import { catchAsync } from "../../../../utils/catchAsync.js";
import bcrypt from "bcrypt";
export const terminateSessionController = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError(`email or password is missing`, 400));
  }

  const user = await checkIfUserExistWithMail({ email });

  if (!user) {
    return next(new AppError(`user with mail:${email} not found!`, 400));
  }
  const auth = await bcrypt.compare(password, user.password_hash);

  if (auth) {
    await updateRefeshToken({
        userId:user.id,
        refreshToken:null
    })

    return res.status(200).send({
        message:"session terminated successfully !",
        terminated:true
    })
  } else {
    return next(new AppError(`Invalid password !`, 400));
  }
});
