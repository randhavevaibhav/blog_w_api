import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers[`authorization`];
    if (!authHeader) {
      return res.status(401).send({ message: "un-authorized access." });
    }

    console.log("authHeader ===> ", authHeader);

    console.log("req.cookies ===> ", req.cookies);

    const accessToken = authHeader.split(" ")[1];

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SCERET, (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "forbidden to access." });
      }
      //all went well
      console.log("decoded.userId ====> ", decoded.userId);
      next();
    });
  } catch (error) {
    console.log("error occured in requireAuth", error);
    return res.status(500).send({
      message:"Internal Server Error"
    })
  }
};
