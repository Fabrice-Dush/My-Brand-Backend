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
const contactsModel_1 = __importDefault(require("../database/models/contactsModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "dushimimanafabricerwanda@gmail.com",
        pass: "zenz lbbo eorl gltg",
    },
});
const sendMessageEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: email,
            to: "dushimimanafabricerwanda@gmail.com",
            subject: "You have a message on your site 😎😎😎",
            html: `<p>You can reply to it or delete it if you want</p>
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
            const contact = new contactsModel_1.default(Object.assign({}, req.body));
            const newContact = yield contact.save();
            yield sendMessageEmail(newContact.email);
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
            const messages = yield contactsModel_1.default.find();
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
            yield contactsModel_1.default.findByIdAndDelete(id);
            const messages = yield contactsModel_1.default.find();
            res.status(200).json({ ok: true, message: "success", data: messages });
        }
        catch (err) {
            res.status(200).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.deleteMessage = deleteMessage;
