import bcrypt from "bcrypt";
import { checkIfUserExistWithMail } from "../../../../model/Users/quries.js";
import jwt from "jsonwebtoken";
import { catchAsync } from "../../../../utils/catchAsync.js";
import { AppError } from "../../../../utils/appError.js";

export const signinController = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(`email or password is missing`, 400));
  }

  // const user = await checkIfUserExistWithMail(email);
  const user = await checkIfUserExistWithMail({ email });

  // console.log("user in sinIn_post ===> ", user);

  if (!user) {
    return next(new AppError(`user with mail:${email} not found!`, 400));
  }

  if (user) {
    //IMP first arg to bcrypt.compare should be password entered by user then hash version of pass stored in db othervise fails,.
    const auth = await bcrypt.compare(password, user.dataValues.password_hash);

    if (auth) {
      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.ACCESS_TOKEN_SCERET,
        { expiresIn: "4m" }
      );

      const userInfo = {
        userId: user.id,
        userName: user.first_name,
        userMail: user.email,
        userProfileImg: user.profile_img_url,
        userBio: user.bio,
        userWebsiteURL: user.website_url,
        userLocation: user.location,
      };

      const refreshToken = jwt.sign(userInfo,
        process.env.REFRESH_TOKEN_SCERET,
        { expiresIn: "10h" }
      );
      //below options required to persist cookie on reload
      // sameSite:"none",
      // secure:true
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 10 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
      });
      res.status(200).send({
        message: `user with mail: ${email} validated !!!`,
        userInfo,
        accessToken,
      });
      return;
    } else {
      return next(new AppError(`Invalid password !`, 400));
    }
  }
});
