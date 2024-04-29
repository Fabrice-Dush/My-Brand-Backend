import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../database/models/usersModel";
import Blog from "../database/models/blogsModel";
import Comment from "../database/models/commentsModel";

export const authenticate = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token: any = req.headers.token;
    if (!token) throw new Error("You need to login to access this resource");
    const decoded: any = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error("Token is incorrect. Logout and login again.");
    req.body.authenticatedUser = user;
    next();
  } catch (err) {
    console.log("In catch block");
    console.log(err);
    res.status(401).json({
      ok: false,
      message: "fail",
      errors: { message: "You need to login to access this resource" },
    });
  }
};

export const authorizeUsers = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.body.authenticatedUser.role === "admin") {
      return next();
    }
    res.status(403).json({
      ok: false,
      message: "fail",
      data: { message: "You're not allowed to access this resource!!!" },
    });
  } catch (err) {
    throw err;
  }
};

export const authorizeBlog = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });
    if (
      req.body.authenticatedUser.id === blog?.author.toString() ||
      req.body.authenticatedUser.role === "admin"
    ) {
      return next();
    }
    res.status(403).json({
      ok: false,
      message: "fail",
      data: { message: "You're not allowed to access this resource!!!" },
    });
  } catch (err) {
    throw err;
  }
};

export const authorizeComment = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { slug, id } = req.params;
    const comment = await Comment.findById(id);
    if (
      req.body.authenticatedUser.id === comment.author.toString() ||
      req.body.authenticatedUser.role === "admin"
    ) {
      return next();
    }
    res.status(403).json({
      ok: false,
      message: "fail",
      data: { message: "You're not allowed to access this resource!!!" },
    });
  } catch (err) {
    throw err;
  }
};
