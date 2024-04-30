import Subscribe from "../database/models/subscribeModel";
import { Request, Response } from "express";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dushimimanafabricerwanda@gmail.com",
    pass: "zenz lbbo eorl gltg",
  },
});

const sendSubscriptionEmail = async (email: string) => {
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
    const sent = await transporter.sendMail(mailOptions);
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
    await subscriber.save({ validateBeforeSave: true });
    console.log("Subscriber email: ", subscriber.email.trim());

    await sendSubscriptionEmail(subscriber.email.trim());
    const subscribers = await Subscribe.find();

    res.status(201).json({ ok: true, message: "success", data: subscribers });
  } catch (err: any) {
    console.log("Error in subscriber: ", err);
    err.message = "You already subscribed";
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
