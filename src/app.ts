import express, { NextFunction, Request, Response } from "express";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import dotenv from "dotenv";
import swaggerSetup from "./swagger";
import cors from "cors";
import allRoutes from "./routes/allRoutes";
const app = express();

dotenv.config();

import "./database/config/database";

swaggerSetup(app);

app.use(cors());
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());

app.get("/", function (req: Request, res: Response) {
  res.send("<h1>Welcome to my brand</h1>");
});

app.use("/api", allRoutes);

//? Global error handling middleware
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // res.status(500).json({mess})
});

app.listen(process.env.PORT, () => {
  console.log(`Server started listening on port ${process.env.PORT}`);
});

export default app;
