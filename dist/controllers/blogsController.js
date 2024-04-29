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
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.uploadUserPhoto = exports.getBlog = exports.getBlogs = void 0;
const blogsModel_1 = __importDefault(require("../database/models/blogsModel"));
const usersModel_1 = __importDefault(require("../database/models/usersModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const subscribeModel_1 = __importDefault(require("../database/models/subscribeModel"));
const getBlogs = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const blogs = yield blogsModel_1.default.find().populate("author");
            console.log(blogs);
            res.status(200).json({ ok: true, message: "success", data: blogs });
        }
        catch (err) {
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.getBlogs = getBlogs;
const getBlog = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const blog = yield blogsModel_1.default.findOne({ slug })
                .populate("author")
                .populate({
                path: "likes",
                populate: { path: "owner" },
            })
                .populate({ path: "comments", populate: { path: "author" } });
            const foundLike = blog.likes.find((like) => { var _a; return like.owner._id.toString() === ((_a = req.body.authenticatedUser) === null || _a === void 0 ? void 0 : _a._id.toString()); });
            res.locals.liked = foundLike ? true : false;
            res.status(200).json({ ok: true, message: "success", data: blog });
        }
        catch (err) {
            console.log("Error in blog: ", err);
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.getBlog = getBlog;
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "dushimimanafabricerwanda@gmail.com",
        pass: "zenz lbbo eorl gltg",
    },
});
const sendSubscriptionEmail = (emails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: process.env.MAIL_EMAIL,
            to: `${emails.join(",")}`,
            subject: "A new article was added to the site",
            html: `<h3>Click this link to visit our site: http://127.0.0.1:5500/blogs.html</h3>`,
        };
        yield transporter.sendMail(mailOptions);
        console.log("Subscription email sent successfully");
    }
    catch (error) {
        console.error("Error sending subscription email:", error);
    }
});
const multerStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "img/");
    },
    filename: (req, file, cb) => {
        const FILE_NAME = file.originalname.split(".")[0];
        const ext = file.mimetype.split("/")[1];
        cb(null, `${FILE_NAME}-${Date.now()}.${ext}`);
    },
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files are allowed"), false);
    }
};
const upload = (0, multer_1.default)({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadUserPhoto = upload.single("image");
cloudinary_1.v2.config({
    cloud_name: "drefu58oe",
    api_key: "978552827499531",
    api_secret: "cR6cup_MaLQi0X3t00R4F0D3p3Y",
});
const createBlog = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.body.authenticatedUser;
            let imagePath = "";
            yield cloudinary_1.v2.uploader.upload(`img/${req.file.filename}`, { public_id: "olympic_flag" }, function (error, result) {
                if (error)
                    throw new Error(error);
                else {
                    imagePath = result.url;
                }
            });
            const blog = new blogsModel_1.default(Object.assign(Object.assign({}, req.body), { slug: req.body.title
                    .replaceAll(/[*./:()?\n]/g, "")
                    .split(" ")
                    .join("_")
                    .toLowerCase(), image: imagePath }));
            const user = yield usersModel_1.default.findById(id);
            if (!user)
                throw new Error("User not found");
            blog.author = user;
            user.blogs.push(blog);
            const userBlogs = [...user.blogs];
            yield blog.save();
            const updatedUser = yield usersModel_1.default.findByIdAndUpdate(user.id, { blogs: userBlogs }, { new: true, runValidators: true });
            const blogs = yield blogsModel_1.default.find();
            console.log("Created blog: ", blog);
            //? Sending email to subscribed users
            const subscribers = yield subscribeModel_1.default.find();
            const emails = subscribers.map((subscriber) => subscriber.email);
            yield sendSubscriptionEmail(emails);
            res.status(201).json({ ok: true, message: "success", data: blogs });
        }
        catch (err) {
            console.log("Error creating a new blog");
            console.log(err);
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.createBlog = createBlog;
const updateBlog = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            let imagePath = "";
            yield cloudinary_1.v2.uploader.upload(`img/${req.file.filename}`, { public_id: "olympic_flag" }, function (error, result) {
                if (error)
                    throw new Error(error);
                else {
                    imagePath = result.url;
                }
            });
            const updatedBlog = yield blogsModel_1.default.findOneAndUpdate({ slug }, Object.assign(Object.assign({}, req.body), { slug: req.body.title
                    .replaceAll(/[*./:()?!\n]/g, "")
                    .split(" ")
                    .join("_")
                    .toLowerCase(), image: imagePath }), { new: true, runValidators: true });
            console.log("Updated blog: ", updatedBlog);
            const url = `http://localhost:8000/api/blogs/${updatedBlog.slug}`;
            res
                .status(200)
                .json({ ok: true, message: "success", data: updatedBlog, url });
        }
        catch (err) {
            console.error("Error updating a blog: ", err);
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.updateBlog = updateBlog;
const deleteBlog = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            yield blogsModel_1.default.findOneAndDelete({ slug });
            let blogs = yield blogsModel_1.default.find();
            res.status(200).json({ ok: true, message: "success", data: blogs });
        }
        catch (err) {
            console.error("Error deleting a blog: ", err);
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.deleteBlog = deleteBlog;
