import { Request, Response } from "express";
import Contact from "./../../../database/models/contactsModel";
import nodemailer from "nodemailer";
import {
  createNewMessage,
  deleteMessageById,
  getAllMessages,
} from "../repository/contactRepository";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dushimimanafabricerwanda@gmail.com",
    pass: "zenz lbbo eorl gltg",
  },
});

const sendMessageEmail = async (email: string) => {
  try {
    const mailOptions = {
      from: email,
      to: "dushimimanafabricerwanda@gmail.com",
      subject: "You have a message on your site 😎😎😎",
      html: `<p>You can reply to it or delete it if you want</p>
      `,
    };
    const sent = await transporter.sendMail(mailOptions);
    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending subscription email:", error);
  }
};

export const getContactForm = function (req: Request, res: Response) {
  res.render("contacts");
};

export const createMessage = async function (req: Request, res: Response) {
  try {
    const newContact = await createNewMessage({ ...req.body });

    await sendMessageEmail(newContact.email);
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
    const messages = await getAllMessages();
    res.status(200).json({ ok: true, message: "success", data: messages });
  } catch (err) {
    res.status(200).json({ ok: false, message: "fail", errors: err });
  }
};

export const deleteMessage = async function (req: Request, res: Response) {
  try {
    const { id } = req.params;
    await deleteMessageById(id);
    const messages = await getAllMessages();
    res.status(200).json({ ok: true, message: "success", data: messages });
  } catch (err) {
    res.status(200).json({ ok: false, message: "fail", errors: err });
  }
};
