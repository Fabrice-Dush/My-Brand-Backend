import { Request, Response } from "express";
import Blog from "./../../../database/models/blogsModel";
import nodemailer from "nodemailer";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Subscribe from "./../../../database/models/subscribeModel";
import {
  deleteOneBlog,
  getAllBlogs,
  getOneBlog,
  getSampleBlog,
  updateOneBlog,
} from "./../repository/blogRepository";
import {
  getOneUser,
  updateOneuser,
} from "../../users/repository/userRepository";
import User from "../../../database/models/usersModel";

export const getBlogs = async function (req: Request, res: Response) {
  try {
    const role = req.headers.role || "user";
    const blogs = await getAllBlogs(role);
    res.status(200).json({ ok: true, message: "success", data: blogs });
  } catch (err) {
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};

export const getBlog = async function (req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const sampleBlog = await getSampleBlog(slug);
    if (!sampleBlog) throw new Error("Blog not Found");
    const blog = await getOneBlog(slug);
    if (!blog.isAccepted)
      throw new Error("This is blog is not approved by the admin yet");
    res.status(200).json({ ok: true, message: "success", data: blog });
  } catch (err: any) {
    res
      .status(500)
      .json({ ok: false, message: "fail", errors: { message: err.message } });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dushimimanafabricerwanda@gmail.com",
    pass: "zenz lbbo eorl gltg",
  },
});

const sendSubscriptionEmail = async (emails: string[], slug: string) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_EMAIL,
      to: `${emails.join(",")}`,
      subject: "A new article was added to the site",
      html: `<h3>Click this link to view the article:https://fabrice-dush.github.io/My-Brand-Frontend/blog.html#${slug}</h3>`,
    };
    await transporter.sendMail(mailOptions);
    console.log("Subscription email sent successfully");
  } catch (error) {
    console.error("Error sending subscription email:", error);
  }
};

const sendMessageEmail = async (user) => {
  try {
    const mailOptions = {
      from: user.email,
      to: "dushimimanafabricerwanda@gmail.com",
      subject: `A new blog was created by ${user.fullname} 🚀🚀🚀`,
      html: `<p>You need to approve in the dashboard before it can be accessed  by anyone else</p>
      `,
    };
    const sent = await transporter.sendMail(mailOptions);
    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending subscription email:", error);
  }
};

const sendApprovalEmail = async (owner, slug: string, approved: boolean) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_EMAIL,
      to: owner.email,
      subject: approved
        ? "Your article was approved by the admin"
        : "Your article is not approved yet.",
      html: `<h3>${
        approved
          ? `Click this link to view your article:https://fabrice-dush.github.io/My-Brand-Frontend/blog.html#${slug}`
          : "Wait until it is approved by the admin"
      }</h3>`,
    };
    await transporter.sendMail(mailOptions);
    console.log("Subscription email sent successfully");
  } catch (error) {
    console.error("Error sending subscription email:", error);
  }
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "img/");
  },
  filename: (req, file, cb) => {
    const FILE_NAME = file.originalname.split(".")[0];
    const ext = file.mimetype.split("/")[1];
    cb(null, `${FILE_NAME}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const uploadUserPhoto = upload.single("image");

cloudinary.config({
  cloud_name: "drefu58oe",
  api_key: "978552827499531",
  api_secret: "cR6cup_MaLQi0X3t00R4F0D3p3Y",
});

export const createBlog = async function (req: Request, res: Response) {
  try {
    const { id } = req.body.authenticatedUser;
    let imagePath = "";
    await cloudinary.uploader.upload(
      `img/${req.file.filename}`,
      { public_id: "olympic_flag" },
      function (error: any, result) {
        if (error) throw new Error(error);
        else {
          imagePath = result.url;
        }
      }
    );

    const blog: any = new Blog({
      ...req.body,
      slug: req.body.title
        .replaceAll(/[*./:()?\n]/g, "")
        .split(" ")
        .join("_")
        .toLowerCase(),
      image: imagePath,
    });

    const user = await getOneUser(id);
    if (!user) throw new Error("User not found");
    if (user.role === "admin") blog.isAccepted = true;

    blog.author = user;
    user.blogs.push(blog);
    const userBlogs = [...user.blogs];
    await blog.save();
    await updateOneuser(user.id, userBlogs);
    const blogs = await getAllBlogs(req.body.authenticatedUser.role);

    //? Sending email to subscribed users
    const subscribers = await Subscribe.find();
    if (subscribers.length > 0) {
      const emails = subscribers.map((subscriber) => subscriber.email);
      await sendSubscriptionEmail(emails, blog.slug);
    }

    if (user.role !== "admin") {
      //? Sending email to the admin
      await sendMessageEmail(user);
    }

    res
      .status(201)
      .json({ ok: true, message: "success", data: blogs, slug: blog.slug });
  } catch (err) {
    console.log("Error creating a new blog");
    console.log(err);
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};

export const updateBlog = async function (req: Request, res: Response) {
  try {
    const { slug } = req.params;
    let imagePath = "";
    await cloudinary.uploader.upload(
      `img/${req.file.filename}`,
      { public_id: "olympic_flag" },
      function (error: any, result) {
        if (error) throw new Error(error);
        else {
          imagePath = result.url;
        }
      }
    );

    const updatedBlog = await updateOneBlog(slug, req.body, imagePath);

    const url = `https://my-brand-backend-n8rt.onrender.com/api/blogs/${updatedBlog.slug}`;
    res.status(200).json({
      ok: true,
      message: "success",
      data: updatedBlog,
      url,
      slug: updatedBlog.slug,
    });
  } catch (err) {
    console.error("Error updating a blog: ", err);
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};

export const approveBlog = async function (req: Request, res: Response) {
  try {
    const user = await User.findById(req.body.authenticatedUser.id);
    if (user.role !== "admin")
      throw new Error("You don't have permission to approve a blog");
    const { isAccepted } = req.body;
    const { slug } = req.params;

    const blog = await Blog.findOneAndUpdate(
      { slug },
      { isAccepted },
      { new: true, runValidators: true }
    ).populate("author");

    //? send email to the blog owner
    sendApprovalEmail(blog.author, blog.slug, blog.isAccepted);

    const blogs = await getAllBlogs(req.body.authenticatedUser.role);
    res.status(200).json({ ok: true, message: "success", data: blogs });
  } catch (err: any) {
    res.status(500).json({ ok: false, message: "fail", errors: err.message });
  }
};

export const deleteBlog = async function (req: Request, res: Response) {
  try {
    const { slug } = req.params;
    await deleteOneBlog(slug);
    const blogs = await getAllBlogs(req.body.authenticatedUser.role);
    res.status(200).json({ ok: true, message: "success", data: blogs });
  } catch (err) {
    console.error("Error deleting blog: ", err);
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};
