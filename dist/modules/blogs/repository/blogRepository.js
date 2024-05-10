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
exports.deleteOneBlog = exports.updateOneBlog = exports.updateBlogBySlug = exports.getOneBlog = exports.getBlogById = exports.getSampleBlog = exports.getAllBlogs = void 0;
const blogsModel_1 = __importDefault(require("./../../../database/models/blogsModel"));
const getAllBlogs = function (role) {
    return __awaiter(this, void 0, void 0, function* () {
        if (role === "admin")
            return yield blogsModel_1.default.find().populate("author");
        return yield blogsModel_1.default.find({ isAccepted: true }).populate("author");
    });
};
exports.getAllBlogs = getAllBlogs;
const getSampleBlog = function (slug) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield blogsModel_1.default.findOne({ slug });
    });
};
exports.getSampleBlog = getSampleBlog;
const getBlogById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield blogsModel_1.default.findById(id)
            .populate("author")
            .populate({ path: "comments", populate: { path: "author" } })
            .populate({ path: "likes", populate: { path: "owner" } });
    });
};
exports.getBlogById = getBlogById;
const getOneBlog = function (slug) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield blogsModel_1.default.findOne({ slug })
            .populate("author")
            .populate({
            path: "likes",
            populate: { path: "owner" },
        })
            .populate({ path: "comments", populate: { path: "author" } });
    });
};
exports.getOneBlog = getOneBlog;
const updateBlogBySlug = function (slug, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield blogsModel_1.default.findOneAndUpdate({ slug }, { $pull: { comments: id } }, { new: true, runValidators: true });
    });
};
exports.updateBlogBySlug = updateBlogBySlug;
const updateOneBlog = function (slug, data, imagePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield blogsModel_1.default.findOneAndUpdate({ slug }, Object.assign(Object.assign({}, data), { slug: data.title
                .replaceAll(/[*\./:()?!\n]/g, "")
                .split(" ")
                .join("_")
                .toLowerCase(), image: imagePath }), { new: true, runValidators: true });
    });
};
exports.updateOneBlog = updateOneBlog;
const deleteOneBlog = function (slug) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield blogsModel_1.default.findOneAndDelete({ slug });
    });
};
exports.deleteOneBlog = deleteOneBlog;
