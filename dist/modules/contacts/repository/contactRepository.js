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
exports.deleteMessageById = exports.getAllMessages = exports.createNewMessage = void 0;
const contactsModel_1 = __importDefault(require("./../../../database/models/contactsModel"));
const createNewMessage = function (data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield contactsModel_1.default.create(data);
    });
};
exports.createNewMessage = createNewMessage;
const getAllMessages = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return yield contactsModel_1.default.find();
    });
};
exports.getAllMessages = getAllMessages;
const deleteMessageById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield contactsModel_1.default.findByIdAndDelete(id);
    });
};
exports.deleteMessageById = deleteMessageById;
