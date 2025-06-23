import bcrypt from "bcrypt";
import {
  checkIfUserExistWithMail,
  getRefreshToken,
  updateRefeshToken,
} from "../../../../model/Users/quries.js";
import jwt from "jsonwebtoken";
import { catchAsync } from "../../../../utils/catchAsync.js";
import { AppError } from "../../../../utils/appError.js";

function isTokenExpired({ token }) {
  try {
    jwt.verify(token, process.env.REFRESH_TOKEN_SCERET);
    return false; // Token is valid and not expired
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("JWT Token has expired.");
      return true;
    } else {
      console.error("JWT Verification Error:", error.message);
      return true; // Other verification errors also indicate invalidity
    }
  }
}

export const signinController = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(`email or password is missing`, 400));
  }

  // const user = await checkIfUserExistWithMail(email);
  //very time costly operation ==>
  const user = await checkIfUserExistWithMail({ email });

  if (!user) {
    return next(
      new AppError(`user with mail:${email} not found!`, 400, {
        SessionTerminated: true,
      })
    );
  }

  //IMP first arg to bcrypt.compare should be password entered by user then hash version of pass stored in db othervise fails,.

  const auth = await bcrypt.compare(password, user.password_hash);

  if (!auth) {
    return next(
      new AppError(`Invalid password !`, 400, {
        SessionTerminated: true,
      })
    );
  }

  const refreshToken = await getRefreshToken({
    userId: user.id,
  });
  // console.log("refreshToken from db ==> ",refreshToken)

  if (refreshToken && !isTokenExpired({ token: refreshToken })) {
    return next(
      new AppError("invalid session", 403, {
        SessionTerminated: false,
      })
    );
  }

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
    userSkills: user.skills,
    userWebsiteURL: user.website_url,
    userLocation: user.location,
  };

  const newRefreshToken = jwt.sign(userInfo, process.env.REFRESH_TOKEN_SCERET, {
    expiresIn: "10h",
  });

  await updateRefeshToken({
    userId: user.id,
    refreshToken: newRefreshToken,
  });
  //below options required to persist cookie on reload
  // sameSite:"none",
  // secure:true
  res.cookie("jwt", newRefreshToken, {
    httpOnly: true,
    maxAge: 10 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
  });
  return res.status(200).send({
    message: `user with mail: ${email} validated !!!`,
    userInfo,
    accessToken,
  });
});
