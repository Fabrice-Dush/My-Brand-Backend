import express, { NextFunction, Request, Response } from "express";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import mongoose from "mongoose";
import dotenv from "dotenv";
// import swaggerJsDoc from "swagger-jsdoc";
// import swaggerUI from "swagger-ui-express";
import cors from "cors";
import authRoutes from "./routes/userRoutes";
import blogRoutes from "./routes/blogRoutes";
import contactRoutes from "./routes/contactRoutes";
import subscribeRoutes from "./routes/subscribeRoutes";
import commentRoutes from "./routes/commentRoutes";
import likeRoutes from "./routes/likeRoutes";
const app = express();

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Node Js Project for mongodb",
//       version: "1.0.0",
//     },
//     servers: [
//       {
//         api: "http://localhost:8000",
//       },
//     ],
//   },
//   apis: ["./mongodb.js"],
// };

dotenv.config();

(async function () {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("Connected to database");
  } catch (err) {
    console.log("ERROR CONNECTING TO DATABASE");
    console.log(err);
  }
})();

app.use(cors());
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());

app.use("/api/", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/blogs/:slug/comments", commentRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/blogs/:slug/likes", likeRoutes);

//? Global error handling middleware
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // res.status(500).json({mess})
});

app.listen(process.env.PORT, () =>
  console.log(`Server started listening on port ${process.env.PORT}`)
);
