"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUsers = exports.verifyAccount = exports.signup = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const userRepository_1 = require("../repository/userRepository");
const usersModel_1 = __importDefault(require("../../../database/models/usersModel"));
const login = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = {
                email: req.body.email,
                password: req.body.password,
            };
            const foundUser = yield (0, userRepository_1.loginUser)(user.email, user.password);
            const token = generateToken(foundUser.id);
            res
                .status(200)
                .json({ ok: true, message: "success", data: foundUser, token });
        }
        catch (err) {
            console.log("Error: ", err);
            const errors = { password: "Wrong email or password" };
            res.status(401).json({ ok: false, message: "fail", errors });
        }
    });
};
exports.login = login;
const maxAge = 30 * 24 * 60 * 60;
const generateToken = function (id) {
    const token = jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
    return token;
};
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "dushimimanafabricerwanda@gmail.com",
        pass: "zenz lbbo eorl gltg",
    },
});
const sendSignupEmail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: "dushimimanafabricerwanda@gmail.com",
            to: user.email,
            subject: "Welcome to our site 😎😎😎",
            html: `
      <h3>Your account verification code: ${user.OTP}</h3>
      `,
        };
        const sent = yield transporter.sendMail(mailOptions);
        console.log("Verfication code sent successfully");
    }
    catch (error) {
        console.error("Error sending subscription email:", error);
    }
});
const generateRandomOTP = function () {
    let otp = "";
    for (let i = 1; i <= 5; i++) {
        otp += Math.floor(Math.random() * 10) + 1;
    }
    return otp;
};
const signup = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //? Generate random OTP
            const otp = generateRandomOTP();
            const user = {
                fullname: req.body.fullName,
                email: req.body.email,
                password: req.body.password,
                // role: "user",
                OTP: otp,
            };
            if (user.email.includes("dushimimanafabricerwanda@gmail.com"))
                user.role = "admin";
            const newUser = yield (0, userRepository_1.createNewUser)(user);
            console.log(newUser.OTP);
            //? send email to the user
            yield sendSignupEmail(newUser);
            const token = generateToken(newUser.id);
            res
                .status(201)
                .json({ ok: true, message: "success", data: newUser, token });
        }
        catch (err) {
            const errors = { fullname: "", email: "", password: "" };
            if (err.code === 11000)
                errors.email = "Email already taken";
            console.error(err);
            res.status(500).json({ ok: false, message: "fail", errors });
        }
    });
};
exports.signup = signup;
const verifyAccount = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { otp } = req.headers;
            const user = yield usersModel_1.default.findOne({ OTP: otp });
            if (!user)
                throw new Error("Verification code is incorrect");
            const updatedUser = yield usersModel_1.default.findByIdAndUpdate(user.id, { isVerified: true }, { new: true, runValidators: true });
            res.status(200).json({ ok: true, message: "success", data: updatedUser });
        }
        catch (err) {
            res
                .status(500)
                .json({ ok: false, message: "fail", errors: { message: err.message } });
        }
    });
};
exports.verifyAccount = verifyAccount;
const getUsers = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield (0, userRepository_1.getAllUsers)();
            res.status(200).json({ ok: true, message: "success", data: users });
        }
        catch (err) {
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.getUsers = getUsers;
const deleteUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield (0, userRepository_1.deleteOneUser)(id);
            const users = yield (0, userRepository_1.getAllUsers)();
            res.status(200).json({ ok: true, message: "success", data: users });
        }
        catch (err) {
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.deleteUser = deleteUser;
