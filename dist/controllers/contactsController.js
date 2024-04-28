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
// const sendMessageEmail = async (contact) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       host: "stmp.gmail.com",
//       port: 587,
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: process.env.MAIL_EMAIL,
//         pass: process.env.MAIL_PASSWORD,
//       },
//     });
//     console.log(contact.email);
//     const mailOptions = {
//       from: contact.email,
//       to: process.env.MAIL_EMAIL,
//       subject: contact.subject,
//       text: contact.message,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log("Subscription email sent successfully");
//   } catch (error) {
//     console.error("Error sending subscription email:", error);
//   }
// };
const getContactForm = function (req, res) {
    res.render("contacts");
};
exports.getContactForm = getContactForm;
const createMessage = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contact = new contactsModel_1.default(Object.assign({}, req.body));
            const newContact = yield contact.save();
            // await sendMessageEmail(newContact);
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
