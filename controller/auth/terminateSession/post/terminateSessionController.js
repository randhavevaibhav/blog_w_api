import {
  checkIfUserExistWithMail,
  getUser,
  updateRefreshToken,
} from "../../../../model/Users/quires.js";
import { AppError } from "../../../../utils/appError.js";
import { catchAsync } from "../../../../utils/catchAsync.js";
import bcrypt from "bcrypt";
export const terminateSessionController = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError(`email or password is missing`, 400));
  }

  const isUserExist = await checkIfUserExistWithMail({ email });
  if (!isUserExist) {
    return next(
      new AppError(`user with mail:${email} not found!`, 400, {
        SessionTerminated: true,
      })
    );
  }

  const user = await getUser({ email });

  if (!user) {
    return next(new AppError(`user with mail:${email} not found!`, 400));
  }
  const auth = await bcrypt.compare(password, user.password_hash);

  if (auth) {
    await updateRefreshToken({
      userId: user.id,
      refreshToken: null,
    });

    return res.status(200).send({
      message: "session terminated successfully !",
      terminated: true,
    });
  } else {
    return next(new AppError(`Invalid password !`, 400));
  }
});
