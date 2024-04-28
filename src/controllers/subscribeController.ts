import Subscribe from "../database/models/subscribeModel";
import { Request, Response } from "express";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "stmp.gmail.com",
  // port: 587,
  port: 465,
  // secure: false, // true for 465, false for other ports
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendSubscriptionEmail = async (email: string) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_EMAIL,
      to: email,
      subject: "Subscription Confirmation",
      text: `Thank you for subscribing to My Page! You have successfully subscribed to receive updates.
      You will receive updates everytime we add new article to our site.
      `,
    };
    const sent = await transporter.sendMail(mailOptions);
    console.log(sent);
    console.log("Subscription email sent successfully");
  } catch (error) {
    console.error("Error sending subscription email:", error);
  }
};

export const getSubscribers = async function (req: Request, res: Response) {
  try {
    const subscribers = await Subscribe.find();
    console.log("Subs: ", subscribers);
    res.status(200).json({ ok: true, message: "success", data: subscribers });
  } catch (err) {
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};

export const createSubscribers = async function (req: Request, res: Response) {
  try {
    const subscriber = new Subscribe({ ...req.body });
    await subscriber.save();
    console.log("Subscriber email: ", subscriber.email.trim());
    // await sendSubscriptionEmail(subscriber.email.trim());
    const subscribers = await Subscribe.find();

    res.status(201).json({ ok: true, message: "success", data: subscribers });
  } catch (err) {
    console.log("Error in subscriber: ", err);
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};

export const deleteSubscribers = async function (req: Request, res: Response) {
  try {
    const { id } = req.params;
    await Subscribe.findByIdAndDelete(id);
    const subscribers = await Subscribe.find();
    res.status(200).json({ ok: true, message: "success", data: subscribers });
  } catch (err) {
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};
