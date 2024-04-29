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
exports.createLike = void 0;
const blogsModel_1 = __importDefault(require("../database/models/blogsModel"));
const likesModel_1 = __importDefault(require("../database/models/likesModel"));
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
