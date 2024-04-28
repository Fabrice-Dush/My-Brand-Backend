"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subscribeSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
});
const Subscribe = mongoose_1.default.model("Subscribe", subscribeSchema);
exports.default = Subscribe;
