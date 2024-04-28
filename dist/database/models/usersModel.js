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
exports.loginStatic = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const blogsModel_1 = __importDefault(require("./blogsModel"));
const likesModel_1 = __importDefault(require("./likesModel"));
const commentsModel_1 = __importDefault(require("./commentsModel"));
const { Schema } = mongoose_1.default;
const { isEmail } = validator_1.default;
const userSchema = new Schema({
    role: {
        type: String,
        default: "user",
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        trim: true,
        minlength: 8,
    },
    email: {
        type: String,
        validate: isEmail,
        lowercase: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
    },
    blogs: [
        {
            type: Schema.Types.ObjectId,
            ref: "Blog",
        },
    ],
});
userSchema.pre("save", function (next) {
    const salt = bcrypt_1.default.genSaltSync(10);
    this.password = bcrypt_1.default.hashSync(this.password, salt);
    next();
});
userSchema.post("findOneAndDelete", function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(user);
        yield blogsModel_1.default.deleteMany({ _id: { $in: user.blogs } });
        yield likesModel_1.default.deleteMany({ owner: user._id });
        yield commentsModel_1.default.deleteMany({ author: user._id });
    });
});
const loginStatic = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield User.findOne({ email });
            if (!user)
                throw new Error("You don't have an account yet");
            const isTrue = yield bcrypt_1.default.compare(password, user.password);
            // const isTrue = password === user.password;
            if (!isTrue)
                throw new Error("Wrong password");
            return user;
        }
        catch (err) {
            throw err;
        }
    });
};
exports.loginStatic = loginStatic;
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
