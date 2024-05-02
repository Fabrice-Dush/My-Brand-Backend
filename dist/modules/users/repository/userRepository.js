"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.deleteOneUser = exports.updateOneuser = exports.getOneUser = exports.getAllUsers = exports.createNewUser = void 0;
const usersModel_1 = __importStar(require("./../../../database/models/usersModel"));
const createNewUser = function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield usersModel_1.default.create(user);
    });
};
exports.createNewUser = createNewUser;
const getAllUsers = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return yield usersModel_1.default.find({ role: "user" });
    });
};
exports.getAllUsers = getAllUsers;
const getOneUser = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield usersModel_1.default.findById(id);
    });
};
exports.getOneUser = getOneUser;
const updateOneuser = function (id, newBlogs) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield usersModel_1.default.findByIdAndUpdate(id, { blogs: newBlogs }, { new: true, runValidators: true });
    });
};
exports.updateOneuser = updateOneuser;
const deleteOneUser = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield usersModel_1.default.findByIdAndDelete(id);
    });
};
exports.deleteOneUser = deleteOneUser;
const loginUser = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, usersModel_1.loginStatic)(email, password);
    });
};
exports.loginUser = loginUser;
