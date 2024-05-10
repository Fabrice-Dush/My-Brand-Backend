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
exports.deleteMessage = exports.getMessages = exports.createMessage = exports.getContactForm = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const contactRepository_1 = require("../repository/contactRepository");
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "dushimimanafabricerwanda@gmail.com",
        pass: "zenz lbbo eorl gltg",
    },
});
const sendMessageEmail = (contact) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: contact.email,
            to: "dushimimanafabricerwanda@gmail.com",
            subject: `${contact.subject}`,
            html: `<p>${contact.message}</p>
      `,
        };
        const sent = yield transporter.sendMail(mailOptions);
        console.log("Message sent successfully");
    }
    catch (error) {
        console.error("Error sending subscription email:", error);
    }
});
const getContactForm = function (req, res) {
    res.render("contacts");
};
exports.getContactForm = getContactForm;
const createMessage = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newContact = yield (0, contactRepository_1.createNewMessage)(Object.assign({}, req.body));
            yield sendMessageEmail(newContact);
            res.status(200).json({
                ok: true,
                message: "success",
                data: newContact,
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.createMessage = createMessage;
const getMessages = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const messages = yield (0, contactRepository_1.getAllMessages)();
            res.status(200).json({ ok: true, message: "success", data: messages });
        }
        catch (err) {
            res.status(200).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.getMessages = getMessages;
const deleteMessage = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield (0, contactRepository_1.deleteMessageById)(id);
            const messages = yield (0, contactRepository_1.getAllMessages)();
            res.status(200).json({ ok: true, message: "success", data: messages });
        }
        catch (err) {
            res.status(200).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.deleteMessage = deleteMessage;
