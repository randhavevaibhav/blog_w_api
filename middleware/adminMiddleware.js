import { checkIfUserExistWithId } from "../model/Users/quires.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const adminMiddleware = catchAsync(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return next(new AppError("userId is required fo admin privileges", 400));
  }

  const isUserExist = await checkIfUserExistWithId({ userId });

  if (!isUserExist) {
    return next(new AppError(`user with userId ${userId} does not exist`, 400));
  }
 
  if (parseInt(userId) === parseInt(process.env.ADMIN_USERID)) {
    return next();
  }

  return next(new AppError(`un-Authorized access`, 400));
});
