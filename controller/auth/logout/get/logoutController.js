import jwt from "jsonwebtoken";
import { updateRefreshToken } from "../../../../model/Users/quires.js";
import { catchAsync } from "../../../../utils/catchAsync.js";

export const logoutController = catchAsync(async (req, res) => {
  //delete client cookies
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.status(204).send({
      message: "no jwt present.",
    });
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      const userId = decoded.userId;

      await updateRefreshToken({
        refreshToken: null,
        userId,
      });
    }
  );

  /* below options should be exactly same as in sign controller i.e when user sign and we set the jwt cookie to refresh token
    otherwise jwt cookie will not be cleared from the client 
      {
      httpOnly: true,
      maxAge: 10 * 60 * 60 * 1000,
      sameSite:"none",
      secure:true
    }
    */
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  return res.status(200).send({
    message: "logged out!",
  });
});
