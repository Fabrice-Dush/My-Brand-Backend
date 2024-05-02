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
const commentsModel_1 = __importDefault(require("./../../../database/models/commentsModel"));
const blogRepository_1 = require("../../blogs/repository/blogRepository");
const commentRepository_1 = require("../repository/commentRepository");
const createComment = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const blog = yield (0, blogRepository_1.getOneBlog)(slug);
            const newComment = new commentsModel_1.default({ text: req.body.comment });
            newComment.author = req.body.authenticatedUser;
            blog.comments.push(newComment);
            yield newComment.save();
            yield blog.save();
            const foundBlog = yield (0, blogRepository_1.getBlogById)(blog.id);
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
            const updatedBlog = yield (0, blogRepository_1.updateBlogBySlug)(slug, id);
            yield (0, commentRepository_1.deleteCommentById)(id);
            const foundBlog = yield (0, blogRepository_1.getBlogById)(updatedBlog.id);
            res.status(200).json({ ok: true, message: "success", data: foundBlog });
        }
        catch (err) {
            console.log("Error deleting comment: ", err);
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.deleteComment = deleteComment;
