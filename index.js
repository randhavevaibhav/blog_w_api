import express from "express";
import sq from "./db.js";
import authRoutes from "./routes/auth/authRoutes.js";
import postsRoutes from "./routes/posts/postsRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:8003",
};

app.use(cors("https://blog-w-api.vercel.app"));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const PORT = 8003;

app.get("/", (req, res) => {
  res.send({
    message: "home page",
  });
});

sq.authenticate()
  .then(() => {
    console.log("successfully connected to DB.");
  })
  .catch((err) => {
    console.log("Error while connecting to database.", err);
  });

app.listen(PORT, () =>
  console.log(`server started at port ${PORT} http://localhost:${PORT}`)
);

app.use(authRoutes);

app.use(postsRoutes);

// app.get("/posts",requireAuth,(res,req)=>{
// res.send({
//   message:"protected post page"
// })

// })
