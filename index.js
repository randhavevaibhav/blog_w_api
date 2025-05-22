import express from "express";
import sq from "./db.js";
import authRoutes from "./routes/auth/authRoutes.js";
import postsRoutes from "./routes/posts/postsRoutes.js";
import bookmarkRoutes from "./routes/bookmark/bookmarkRoutes.js"
import dashboardRoutes from "./routes/dashboard/dashboardRoutes.js";
import uploadFileRoute from "./routes/uploadFile/uploadFileRoute.js";
import userRoutes from "./routes/user/userRoutes.js";
import commentsRoute from "./routes/comments/commentsRoute.js";
import postLikesRoute from "./routes/postLikes/PostLikesRoute.js";
import convertRoutes from "./routes/convert/convertRoutes.js";

import refreshTokenRoute from "./routes/refreshToken/refreshTokenRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AppError } from "./utils/appError.js";
import {
  LOCAL_CLIENT_ORIGIN,
  REMOTE_CLIENT_ORIGIN,
} from "./utils/constants.js";
import { globalErrorController } from "./controller/error/globalErrorController.js";

//no exports from index js

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: [LOCAL_CLIENT_ORIGIN, REMOTE_CLIENT_ORIGIN, "http://127.0.0.1:5173"],
  credentials: true,
};

const PORT = 8003;

app.use(cors(corsOptions));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(authRoutes);
app.use(postsRoutes);
app.use(dashboardRoutes);
app.use(bookmarkRoutes);
app.use(userRoutes);
app.use(commentsRoute);
app.use(postLikesRoute);
app.use(refreshTokenRoute);
app.use(uploadFileRoute);
app.use(convertRoutes);

app.get("/", (req, res) => {
  res.send({
    message: "home page",
  });
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorController);

app.listen(PORT, () =>
  console.log(`server started at port ${PORT} http://localhost:${PORT}`)
);

sq.authenticate()
  .then(() => {
    console.log("successfully connected to DB.");
  })
  .catch((err) => {
    console.log("Error while connecting to database.", err);
  });
