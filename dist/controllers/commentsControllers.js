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
exports.deleteComment = exports.createComment = void 0;
const blogsModel_1 = __importDefault(require("../database/models/blogsModel"));
const commentsModel_1 = __importDefault(require("../database/models/commentsModel"));
const createComment = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Reaching this far");
            const { slug } = req.params;
            console.log(req.params);
            const blog = yield blogsModel_1.default.findOne({ slug });
            console.log("Blog: ", blog);
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
