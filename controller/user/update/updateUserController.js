import { updateUser } from "../../../model/Users/quries.js";
import { AppError } from "../../../utils/appError.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const updateUserController = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { userMail, userName } = req.body;
  if (!userId || !userMail || !userName) {
    return next(
      new AppError(`Please send all required fields. userId,userName,userMail`)
    );
  }

  const result = await updateUser(userId, userName, userMail);

  if (result[0] === 0) {
    return res.sendStatus(304);
  }

  // console.log("result of updateUser ===> ",result);

  return res.status(200).send({
    message: "user updated",
  });
});
