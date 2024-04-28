import express, { NextFunction, Request, Response } from "express";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/userRoutes";
import blogRoutes from "./routes/blogRoutes";
import contactRoutes from "./routes/contactRoutes";
import subscribeRoutes from "./routes/subscribeRoutes";
import { checkUser } from "./middleware/middleware";
const app = express();

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

app.use(checkUser);
app.use("/", authRoutes);
app.use("/contact", contactRoutes);
app.use("/blogs", blogRoutes);
app.use("/subscribe", subscribeRoutes);

//? Global error handling middleware
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // res.status(500).json({mess})
});

app.listen(process.env.PORT, () =>
  console.log(`Server started listening on port ${process.env.PORT}`)
);
