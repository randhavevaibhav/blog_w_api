export const logoutController = async (req, res) => {
  try {
    //delete client cookies
    const cookies = req.cookies;
    if (!cookies.jwt) {
      return res.status(204).send({
        message: "no jwt present.",
      });
    }

    /* below options should be excatly same as in sigin controller i.e when user sign and we set the jwt cookie to refresh token
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
      message: "cookies cleared!",
    });
  } catch (error) {
    console.log("Error ocuured in logoutController ==> ", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
