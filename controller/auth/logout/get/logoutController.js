export const logoutController = async (req, res) => {
  try {
    //delete client cookies
    const cookies = req.cookies;
    if (!cookies.jwt) {
      return res.status(204).send({
        message: "no jwt present.",
      });
    }

    const refreshToken = cookies.jwt;

    res.clearCookie("jwt", { httpOnly: true });

    return res.status(200).send({
      message: "cookies cleared!",
    });
  } catch (error) {
    console.log("Error ocuured in logoutController ==> ", error);
  }
};
