import jwt from "jsonwebtoken";
import { AppError } from "../../utils/appError.js";

export const refreshTokenController = async (req, res, next) => {
  const cookies = req.cookies;
  // const {userId} = req.params;
  if (!cookies?.jwt) {
    return next(new AppError(`JWT cookie not present.`, 401));
  }
  // console.log("userId refreshTokenController ===> ",userId)
  // console.log("cookies.jwt in refreshTokenController ===> ", cookies.jwt);
  const refreshToken = cookies.jwt;

  //eval jwt

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    
    if (err) {
   
      return next(new AppError(`access forbidden`, 403));
    }
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );

    const {
      userId,
      userName,
      userMail,
      userProfileImg,
      userBio,
      userSkills,
      userWebsiteURL,
      userLocation,
    } = decoded;

    const userInfo = {
      userId,
      userName,
      userMail,
      userProfileImg,
      userBio,
      userSkills,
      userWebsiteURL,
      userLocation,
    };
    res.status(200).send({
      accessToken,
      userInfo
    });
  });
};
