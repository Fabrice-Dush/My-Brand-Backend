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
exports.isVerifiedFun = exports.authorizeComment = exports.authorizeBlog = exports.authorizeUsers = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usersModel_1 = __importDefault(require("../database/models/usersModel"));
const blogsModel_1 = __importDefault(require("../database/models/blogsModel"));
const commentsModel_1 = __importDefault(require("../database/models/commentsModel"));
const authenticate = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            let token;
            if ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.includes("Bearer")) {
                token = req.headers.authorization.split(" ").at(-1);
            }
            if (!token)
                throw new Error("You don't have permission to access this resource");
            const decoded = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = yield usersModel_1.default.findById(decoded.id);
            if (!user)
                throw new Error("Token is incorrect. Logout and login again.");
            req.body.authenticatedUser = user;
            next();
        }
        catch (err) {
            console.log("In catch block");
            console.log(err);
            res.status(401).json({
                ok: false,
                message: "fail",
                errors: { message: "You don't have permission to access this resource" },
            });
        }
    });
};
exports.authenticate = authenticate;
const authorizeUsers = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.body.authenticatedUser.role === "admin") {
                return next();
            }
            res.status(403).json({
                ok: false,
                message: "fail",
                data: { message: "You're not allowed to access this resource!!!" },
            });
        }
        catch (err) {
            throw err;
        }
    });
};
exports.authorizeUsers = authorizeUsers;
const authorizeBlog = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const blog = yield blogsModel_1.default.findOne({ slug });
            if (req.body.authenticatedUser.id === (blog === null || blog === void 0 ? void 0 : blog.author.toString()) ||
                req.body.authenticatedUser.role === "admin") {
                return next();
            }
            res.status(403).json({
                ok: false,
                message: "fail",
                data: { message: "You're not allowed to access this resource!!!" },
            });
        }
        catch (err) {
            throw err;
        }
    });
};
exports.authorizeBlog = authorizeBlog;
const authorizeComment = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { slug, id } = req.params;
            const comment = yield commentsModel_1.default.findById(id);
            if (req.body.authenticatedUser.id === comment.author.toString() ||
                req.body.authenticatedUser.role === "admin") {
                return next();
            }
            res.status(403).json({
                ok: false,
                message: "fail",
                data: { message: "You're not allowed to access this resource!!!" },
            });
        }
        catch (err) {
            throw err;
        }
    });
};
exports.authorizeComment = authorizeComment;
const isVerifiedFun = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            if (!((_a = req.body.authenticatedUser) === null || _a === void 0 ? void 0 : _a.isVerified))
                throw new Error("Verify your account first");
            next();
        }
        catch (err) {
            res
                .status(500)
                .json({ ok: false, message: "fail", errors: { message: err.message } });
        }
    });
};
exports.isVerifiedFun = isVerifiedFun;
