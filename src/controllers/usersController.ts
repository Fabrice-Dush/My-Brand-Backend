import jwt from "jsonwebtoken";
import User, { loginStatic } from "../database/models/usersModel";
import { Request, Response } from "express";

export const login = async function (req: Request, res: Response) {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };
    const foundUser = await loginStatic(user.email, user.password);
    const token = generateToken(foundUser.id);
    res
      .status(200)
      .json({ ok: true, message: "success", data: foundUser, token });
  } catch (err) {
    console.log("Error: ", err);
    const errors = { password: "Wrong email or password" };
    res.status(403).json({ ok: false, message: "fail", errors });
  }
};

const maxAge = 30 * 24 * 60 * 60;
const generateToken = function (id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
  return token;
};

export const signup = async function (req: Request, res: Response) {
  try {
    const user = {
      fullname: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      role: "user",
    };

    if (user.email.includes("dushimimanafabricerwanda@gmail.com"))
      user.role = "admin";

    const newUser = new User(user);
    await newUser.save();

    const token = generateToken(newUser.id);
    res
      .status(201)
      .json({ ok: true, message: "success", data: newUser, token });
  } catch (err: any) {
    const errors = { fullname: "", email: "", password: "" };
    if (err.code === 11000) errors.email = "Email already taken";
    console.error(err);
    res.status(500).json({ ok: false, message: "fail", errors });
  }
};

export const logout = async function (req: Request, res: Response) {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/blogs");
  } catch (err) {}
};

export const getUsers = async function (req: Request, res: Response) {
  try {
    const users = await User.find({ role: "user" });
    res.status(200).json({ ok: true, message: "success", data: users });
  } catch (err) {
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};

export const deleteUser = async function (req: Request, res: Response) {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    const users = await User.find();
    res.status(200).json({ ok: true, message: "success", data: users });
  } catch (err) {
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};
