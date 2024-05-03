import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { Request, Response } from "express";
import {
  createNewUser,
  deleteOneUser,
  getAllUsers,
  loginUser,
} from "../repository/userRepository";
import User from "../../../database/models/usersModel";

export const login = async function (req: Request, res: Response) {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };
    const foundUser = await loginUser(user.email, user.password);
    const token = generateToken(foundUser.id);
    res
      .status(200)
      .json({ ok: true, message: "success", data: foundUser, token });
  } catch (err) {
    console.log("Error: ", err);
    const errors = { password: "Wrong email or password" };
    res.status(401).json({ ok: false, message: "fail", errors });
  }
};

const maxAge = 30 * 24 * 60 * 60;
const generateToken = function (id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
  return token;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dushimimanafabricerwanda@gmail.com",
    pass: "zenz lbbo eorl gltg",
  },
});

const sendSignupEmail = async (user) => {
  try {
    const mailOptions = {
      from: "dushimimanafabricerwanda@gmail.com",
      to: user.email,
      subject: "Welcome to our site 😎😎😎",
      html: `
      <h3>Your account verification code: ${user.OTP}</h3>
      `,
    };
    const sent = await transporter.sendMail(mailOptions);
    console.log("Verfication code sent successfully");
  } catch (error) {
    console.error("Error sending subscription email:", error);
  }
};

const generateRandomOTP = function () {
  let otp = "";
  for (let i = 1; i <= 5; i++) {
    otp += Math.floor(Math.random() * 10) + 1;
  }
  return otp;
};

export const signup = async function (req: Request, res: Response) {
  try {
    //? Generate random OTP
    const otp = generateRandomOTP();

    const user = {
      fullname: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      role: "user",
      OTP: otp,
    };

    if (user.email.includes("dushimimanafabricerwanda@gmail.com"))
      user.role = "admin";

    const newUser = await createNewUser(user);
    console.log(newUser.OTP);

    //? send email to the user
    await sendSignupEmail(newUser);

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

export const verifyAccount = async function (req: Request, res: Response) {
  try {
    const { otp } = req.headers;
    const user = await User.findOne({ OTP: otp });
    if (!user) throw new Error("Verification code is incorrect");
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { isVerified: true },
      { new: true, runValidators: true }
    );
    res.status(200).json({ ok: true, message: "success", data: updatedUser });
  } catch (err: any) {
    res
      .status(500)
      .json({ ok: false, message: "fail", errors: { message: err.message } });
  }
};

export const getUsers = async function (req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    res.status(200).json({ ok: true, message: "success", data: users });
  } catch (err) {
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};

export const deleteUser = async function (req: Request, res: Response) {
  try {
    const { id } = req.params;
    await deleteOneUser(id);
    const users = await getAllUsers();
    res.status(200).json({ ok: true, message: "success", data: users });
  } catch (err) {
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};
