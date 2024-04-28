"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteUser = exports.getUsers = exports.logout = exports.signup = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usersModel_1 = __importStar(require("../database/models/usersModel"));
const login = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = {
                email: req.body.email,
                password: req.body.password,
            };
            const foundUser = yield (0, usersModel_1.loginStatic)(user.email, user.password);
            const token = generateToken(foundUser.id);
            res
                .status(200)
                .json({ ok: true, message: "success", data: foundUser, token });
        }
        catch (err) {
            console.log("Error: ", err);
            const errors = { password: "Wrong email or password" };
            res.status(403).json({ ok: false, message: "fail", errors });
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
const signup = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = {
                fullname: req.body.fullName,
                email: req.body.email,
                password: req.body.password,
                role: "user",
            };
            if (user.email.includes("dushimimanafabricerwanda@gmail.com"))
                user.role = "admin";
            const newUser = new usersModel_1.default(user);
            yield newUser.save();
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
const logout = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.cookie("jwt", "", { maxAge: 1 });
            res.redirect("/blogs");
        }
        catch (err) { }
    });
};
exports.logout = logout;
const getUsers = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield usersModel_1.default.find({ role: "user" });
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
            yield usersModel_1.default.findByIdAndDelete(id);
            const users = yield usersModel_1.default.find();
            res.status(200).json({ ok: true, message: "success", data: users });
        }
        catch (err) {
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.deleteUser = deleteUser;
