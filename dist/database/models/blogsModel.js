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
const mongoose_1 = __importDefault(require("mongoose"));
const likesModel_1 = __importDefault(require("./likesModel"));
const commentsModel_1 = __importDefault(require("./commentsModel"));
const usersModel_1 = __importDefault(require("./usersModel"));
const { Schema } = mongoose_1.default;
const blogSchema = new Schema({
    image: {
        type: String,
        required: [true, "A blog should have an image"],
        lowercase: true,
        trim: true,
    },
    title: {
        type: String,
        required: [true, "A blog should have a title"],
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, "A blog should have a description"],
        trim: true,
    },
    longDescription: String,
    date: {
        type: String,
        default: new Date().toDateString(),
    },
    tags: {
        type: String,
        enum: [
            "Web Development",
            "Software Development",
            "Frontend Development",
            "Backend Development",
        ],
        default: "Web Development",
    },
    readMinutes: {
        type: Number,
        default: 15,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    slug: {
        type: String,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Like",
        },
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
});
blogSchema.post("findOneAndDelete", function (blog) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletedLikes = yield likesModel_1.default.deleteMany({ _id: { $in: blog.likes } });
            const deletedComments = yield commentsModel_1.default.deleteMany({
                _id: { $in: blog.comments },
            });
            const updatedUser = yield usersModel_1.default.findOneAndUpdate({ _id: blog.author._id }, { $pull: { blogs: blog._id } }, { new: true, runValidators: true });
            console.log("DeletedLikes: ", deletedLikes);
            console.log("DeletedComments: ", deletedComments);
            console.log("Updateduser: ", updatedUser);
        }
        catch (err) {
            console.error("Error Stuck in deletion: ", err);
        }
    });
});
const Blog = mongoose_1.default.model("Blog", blogSchema);
exports.default = Blog;
