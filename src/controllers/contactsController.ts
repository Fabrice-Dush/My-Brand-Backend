import { Request, Response } from "express";
import Contact from "../database/models/contactsModel";
import nodemailer from "nodemailer";

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

export const getContactForm = function (req: Request, res: Response) {
  res.render("contacts");
};

export const createMessage = async function (req: Request, res: Response) {
  try {
    const contact = new Contact({ ...req.body });
    const newContact = await contact.save();
    // await sendMessageEmail(newContact);
    res.status(200).json({
      ok: true,
      message: "success",
      data: newContact,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};

export const getMessages = async function (req: Request, res: Response) {
  try {
    const messages = await Contact.find();
    res.status(200).json({ ok: true, message: "success", data: messages });
  } catch (err) {
    res.status(200).json({ ok: false, message: "fail", errors: err });
  }
};

export const deleteMessage = async function (req: Request, res: Response) {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    const messages = await Contact.find();
    res.status(200).json({ ok: true, message: "success", data: messages });
  } catch (err) {
    res.status(200).json({ ok: false, message: "fail", errors: err });
  }
};
