import jwt from "jsonwebtoken";
export const refreshTokenController = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.status(401).send({ message: "JWT cookie not present." });
    }
    console.log("cookies.jwt in refreshTokenController ===> ", cookies.jwt);
    const refreshToken = cookies.jwt;

    //eval jwt

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SCERET,
      (err, decoded) => {
        if (err) {
          return res.status(403).send({
            message: `access forbidden`,
          });
        }
        const accessToken = jwt.sign(
          { userId: decoded.userId },
          process.env.ACCESS_TOKEN_SCERET,
          { expiresIn: "2m" }
        );
        res.status(200).send({
          accessToken,
          userId: decoded.userId,
        });
      }
    );
  } catch (error) {
    console.log("Error ocuured in refreshTokenController ==> ", error);
    return res.status(500).send({
      message:"Internal Server Error"
    })
  }
};
