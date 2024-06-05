import express from "express";
import mongoose from "mongoose";
import userRoutes from "./route/user.route.js";
import authRoutes from "./route/auth.route.js";
import cookieParser from "cookie-parser";
import postRoutes from "./route/post.route.js";

mongoose
  .connect(
    "mongodb+srv://pankaj:pankaj@mern-blog.g1uylyi.mongodb.net/?retryWrites=true&w=majority&appName=mern-blog"
  )
  .then(() => {
    console.log("MongoDB is connected");
  });
const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

//Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    message: message,
    success: false,
    statusCode,
  });
});
