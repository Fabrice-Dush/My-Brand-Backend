"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const likeSchema = new Schema({
    likeCount: Number,
    blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});
const Like = mongoose_1.default.model("Like", likeSchema);
exports.default = Like;
