"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const contactSchema = new Schema({
    fullname: { type: String, trim: true },
    email: {
        type: String,
        //  unique: true,
        trim: true,
        lowercase: true,
    },
    subject: { type: String, trim: true },
    message: { type: String, trim: true },
});
const Contact = mongoose_1.default.model("Contact", contactSchema);
exports.default = Contact;
