import jwt from "jsonwebtoken";

export const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers[`authorization`];
  const accessToken = authHeader.split(" ")[1];

  if (!accessToken) {
    req.user = null;
    return next();
    
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const { userId } = decoded;
    req.user = { userId };
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
