import express from "express";
import sq from "./db.js";
import authRoutes from "./routes/auth/authRoutes.js";
import postsRoutes from "./routes/posts/postsRoutes.js";
import hashtagsRoutes from "./routes/hashtags/hashtagsRoutes.js";
import bookmarkRoutes from "./routes/bookmark/bookmarkRoutes.js";
import followerRoutes from "./routes/follower/followerRoutes.js";
import uploadFileRoute from "./routes/uploadFile/uploadFileRoute.js";
import userRoutes from "./routes/user/userRoutes.js";
import commentsRoute from "./routes/comments/commentsRoute.js";
import postLikesRoute from "./routes/postLikes/PostLikesRoute.js";
import commentLikesRoute from "./routes/commentLikes/CommentLikes.js";
import convertRoutes from "./routes/convert/convertRoutes.js";

import refreshTokenRoute from "./routes/refreshToken/refreshTokenRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AppError } from "./utils/appError.js";
import {
  LOCAL_CLIENT_ORIGIN,
  PORT,
  REMOTE_CLIENT_ORIGIN,
  REMOTE_TEST_CLIENT_ORIGIN,
} from "./utils/constants.js";
import { globalErrorController } from "./controller/error/globalErrorController.js";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import { tags } from "./docs/common.js";
import { paths } from "./docs/paths.js";
import { config } from "./utils/config.js";
import { getRandomIntFromRange } from "./utils/utils.js";

const limiter = rateLimit({
  windowMs:getRandomIntFromRange({
    min:900,
    max:1000
  }),
  limit: 20, // each IP can make up to 20 requests per `windowsMs`
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
  message: {
    message: "Too many requests",
  },
});

//no exports from index js

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog w API",
      version: "1.0.0",
      description: "Blog W blogging website API doc",
    },
    servers: [
      {
        url: config.API_URL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "jwt",
        },
      },
    },
    paths,
    tags,
  },
  // Path to the API docs (where your routes are)
  apis: ["./docs/*.doc.js"],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
const corsOptions = {
  origin: [
    LOCAL_CLIENT_ORIGIN,
    REMOTE_CLIENT_ORIGIN,
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    REMOTE_TEST_CLIENT_ORIGIN,
  ],
  credentials: true,
};

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(limiter);
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.get("/api-docs", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>Blog W API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
  </head>

  <body>
    <div id="swagger-ui"></div>

    <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>

    <script>
      const ui = SwaggerUIBundle({
        url: "/swagger.json",
        dom_id: "#swagger-ui",
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout"
      });
    </script>
  </body>
  </html>
  `);
});

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(authRoutes);
app.use(postsRoutes);
app.use(hashtagsRoutes);
app.use(bookmarkRoutes);
app.use(followerRoutes);
app.use(userRoutes);
app.use(commentsRoute);
app.use(postLikesRoute);
app.use(commentLikesRoute);
app.use(refreshTokenRoute);
app.use(uploadFileRoute);
app.use(convertRoutes);

app.get("/", (req, res) => {
  res.send({
    message: "home page",
  });
});

app.get("/swagger.json", (req, res) => {
  res.json(swaggerDocs);
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

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

app.use(globalErrorController);
