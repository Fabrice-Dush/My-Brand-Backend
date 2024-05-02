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
exports.deleteSubscribers = exports.createSubscribers = exports.getSubscribers = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const subscriberRepository_1 = require("./../repository/subscriberRepository");
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "dushimimanafabricerwanda@gmail.com",
        pass: "zenz lbbo eorl gltg",
    },
});
const sendSubscriptionEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: process.env.MAIL_EMAIL,
            to: email,
            subject: "Subscription Confirmation",
            html: `<p>Thank you for subscribing to our site!</p>
      <p>You have successfully subscribed to receive updates.
      You will receive updates everytime we add new article to our site.
      </p>
      <h3>Click this link to visit our site:https://fabrice-dush.github.io/My-Brand-Frontend/blogs.html</h3>
      `,
        };
        const sent = yield transporter.sendMail(mailOptions);
        console.log("Subscription email sent successfully");
    }
    catch (error) {
        console.error("Error sending subscription email:", error);
    }
});
const getSubscribers = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const subscribers = yield (0, subscriberRepository_1.getAllSubscribers)();
            console.log("Subs: ", subscribers);
            res.status(200).json({ ok: true, message: "success", data: subscribers });
        }
        catch (err) {
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.getSubscribers = getSubscribers;
const createSubscribers = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const subscriber = yield (0, subscriberRepository_1.createNewSubscriber)(Object.assign({}, req.body));
            yield sendSubscriptionEmail(subscriber.email.trim());
            const subscribers = yield (0, subscriberRepository_1.getAllSubscribers)();
            res.status(201).json({ ok: true, message: "success", data: subscribers });
        }
        catch (err) {
            console.log("Error in subscriber: ", err);
            err.message = "You already subscribed";
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.createSubscribers = createSubscribers;
const deleteSubscribers = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield (0, subscriberRepository_1.deleteSubscriberById)(id);
            const subscribers = yield (0, subscriberRepository_1.getAllSubscribers)();
            res.status(200).json({ ok: true, message: "success", data: subscribers });
        }
        catch (err) {
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.deleteSubscribers = deleteSubscribers;
