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
const blogsModel_1 = __importDefault(require("./../../../database/models/blogsModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const subscribeModel_1 = __importDefault(require("./../../../database/models/subscribeModel"));
const blogRepository_1 = require("./../repository/blogRepository");
const userRepository_1 = require("../../users/repository/userRepository");
const getBlogs = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const blogs = yield (0, blogRepository_1.getAllBlogs)();
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
            const sampleBlog = yield (0, blogRepository_1.getSampleBlog)(slug);
            if (!sampleBlog)
                throw new Error("Blog not Found");
            const blog = yield (0, blogRepository_1.getOneBlog)(slug);
            res.status(200).json({ ok: true, message: "success", data: blog });
        }
        catch (err) {
            res
                .status(500)
                .json({ ok: false, message: "fail", errors: { message: err.message } });
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
const sendSubscriptionEmail = (emails, slug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: process.env.MAIL_EMAIL,
            to: `${emails.join(",")}`,
            subject: "A new article was added to the site",
            html: `<h3>Click this link to view the article:https://fabrice-dush.github.io/My-Brand-Frontend/blog.html#${slug}</h3>`,
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
            const user = yield (0, userRepository_1.getOneUser)(id);
            if (!user)
                throw new Error("User not found");
            blog.author = user;
            user.blogs.push(blog);
            const userBlogs = [...user.blogs];
            yield blog.save();
            yield (0, userRepository_1.updateOneuser)(user.id, userBlogs);
            const blogs = yield (0, blogRepository_1.getAllBlogs)();
            //? Sending email to subscribed users
            const subscribers = yield subscribeModel_1.default.find();
            if (subscribers.length > 0) {
                const emails = subscribers.map((subscriber) => subscriber.email);
                yield sendSubscriptionEmail(emails, blog.slug);
            }
            res
                .status(201)
                .json({ ok: true, message: "success", data: blogs, slug: blog.slug });
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
            const updatedBlog = yield (0, blogRepository_1.updateOneBlog)(slug, req.body, imagePath);
            const url = `https://my-brand-backend-n8rt.onrender.com/api/blogs/${updatedBlog.slug}`;
            res.status(200).json({
                ok: true,
                message: "success",
                data: updatedBlog,
                url,
                slug: updatedBlog.slug,
            });
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
            yield (0, blogRepository_1.deleteOneBlog)(slug);
            let blogs = yield (0, blogRepository_1.getAllBlogs)();
            res.status(200).json({ ok: true, message: "success", data: blogs });
        }
        catch (err) {
            console.error("Error deleting blog: ", err);
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.deleteBlog = deleteBlog;
