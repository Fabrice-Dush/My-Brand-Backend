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
exports.deleteBlog = exports.updateBlog = exports.updateBlogForm = exports.createLike = exports.deleteComment = exports.createComment = exports.createBlog = exports.createBlogForm = exports.getBlog = exports.getBlogs = void 0;
const blogsModel_1 = __importDefault(require("../database/models/blogsModel"));
const usersModel_1 = __importDefault(require("../database/models/usersModel"));
const commentsModel_1 = __importDefault(require("../database/models/commentsModel"));
const likesModel_1 = __importDefault(require("../database/models/likesModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const getBlogs = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const blogs = yield blogsModel_1.default.find().populate("author");
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
            console.log(slug);
            const blog = yield blogsModel_1.default.findOne({ slug })
                .populate("author")
                .populate({
                path: "likes",
                populate: { path: "owner" },
            })
                .populate({ path: "comments", populate: { path: "author" } });
            console.log(blog);
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
const createBlogForm = function (req, res) {
    try {
        res.render("new");
    }
    catch (err) {
        res.redirect("/blogs");
    }
};
exports.createBlogForm = createBlogForm;
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: "stmp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
    },
});
// const sendSubscriptionEmail = async (email: string, blog) => {
//   try {
//     const mailOptions = {
//       from: process.env.MAIL_EMAIL,
//       to: email,
//       subject: "A new article was added to the site",
//       text: `Visit our wesbite to learn more: http://127.0.0.1:5500/blogs`,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log("Subscription email sent successfully");
//   } catch (error) {
//     console.error("Error sending subscription email:", error);
//   }
// };
const createBlog = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.body.authenticatedUser;
            const blog = new blogsModel_1.default(Object.assign(Object.assign({}, req.body), { slug: req.body.title
                    .replaceAll(/[*./:()?\n]/g, "")
                    .split(" ")
                    .join("_")
                    .toLowerCase() }));
            const user = yield usersModel_1.default.findById(id);
            if (!user)
                throw new Error("User not found");
            blog.author = user;
            user.blogs.push(blog);
            const userBlogs = [...user.blogs];
            yield blog.save();
            const updatedUser = yield usersModel_1.default.findByIdAndUpdate(user.id, { blogs: userBlogs }, { new: true, runValidators: true });
            const blogs = yield blogsModel_1.default.find();
            //? Sending email to subscribed users
            // const subscribers = await Subscribe.find();
            // subscribers.forEach((subscriber) =>
            //   sendSubscriptionEmail(subscriber.email, blog)
            // );
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
const createComment = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const blog = yield blogsModel_1.default.findOne({ slug });
            const newComment = new commentsModel_1.default({ text: req.body.comment });
            newComment.author = req.body.authenticatedUser;
            blog.comments.push(newComment);
            yield newComment.save();
            yield blog.save();
            const foundBlog = yield blogsModel_1.default.findById(blog.id)
                .populate("author")
                .populate({ path: "comments", populate: { path: "author" } })
                .populate({ path: "likes", populate: { path: "owner" } });
            console.log("Blog: ", foundBlog);
            res.status(201).json({ ok: true, message: "success", data: foundBlog });
        }
        catch (err) {
            console.log("Error creating comment: ", err);
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.createComment = createComment;
const deleteComment = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { slug, id } = req.params;
            const updatedBlog = yield blogsModel_1.default.findOneAndUpdate({ slug }, { $pull: { comments: id } }, { new: true, runValidators: true });
            const deletedComment = yield commentsModel_1.default.findByIdAndDelete(id);
            const foundBlog = yield blogsModel_1.default.findById(updatedBlog.id)
                .populate("author")
                .populate({ path: "comments", populate: { path: "author" } })
                .populate({ path: "likes", populate: { path: "owner" } });
            res.status(200).json({ ok: true, message: "success", data: foundBlog });
        }
        catch (err) {
            console.log("Error deleting comment: ", err);
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.deleteComment = deleteComment;
const createLike = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const blog = yield blogsModel_1.default.findOne({ slug }).populate({
                path: "likes",
                populate: { path: "owner" },
            });
            const foundLike = blog.likes.find((like) => like.owner._id.toString() === req.body.authenticatedUser._id.toString());
            let actualBlog;
            if (foundLike) {
                actualBlog = yield blogsModel_1.default.findByIdAndUpdate(blog.id, { $pull: { likes: foundLike.id } }, { new: true, runValidators: true });
                const deletedLike = yield likesModel_1.default.findByIdAndDelete(foundLike.id);
            }
            else {
                const like = new likesModel_1.default({ likeCount: 1 });
                like.owner = req.body.authenticatedUser;
                like.blog = blog;
                blog.likes.push(like);
                yield like.save();
                yield blog.save();
                actualBlog = blog;
            }
            const realBlog = yield blogsModel_1.default.findById(actualBlog.id)
                .populate("author")
                .populate({ path: "comments", populate: { path: "author" } })
                .populate({ path: "likes", populate: { path: "owner" } });
            console.log(realBlog);
            res.status(201).json({ ok: true, message: "success", data: realBlog });
        }
        catch (err) {
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.createLike = createLike;
const updateBlogForm = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const blog = yield blogsModel_1.default.findOne({ slug });
            res.render("edit", { blog });
        }
        catch (err) {
            console.log("Error getting something: ", err);
            res.redirect(`/blogs/${req.params.slug}`);
        }
    });
};
exports.updateBlogForm = updateBlogForm;
const updateBlog = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const updatedBlog = yield blogsModel_1.default.findOneAndUpdate({ slug }, Object.assign(Object.assign({}, req.body), { slug: req.body.title
                    .replaceAll(/[*./:()?!\n]/g, "")
                    .split(" ")
                    .join("_")
                    .toLowerCase() }), { new: true, runValidators: true });
            const url = `http://localhost:8000/blogs/${updatedBlog.slug}`;
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
            console.log("Reached here");
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
