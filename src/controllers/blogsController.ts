import { Request, Response } from "express";
import Blog from "../database/models/blogsModel";
import User from "../database/models/usersModel";
import nodemailer from "nodemailer";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Subscribe from "../database/models/subscribeModel";

export const getBlogs = async function (req: Request, res: Response) {
  try {
    const blogs = await Blog.find().populate("author");
    res.status(200).json({ ok: true, message: "success", data: blogs });
  } catch (err) {
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};

export const getBlog = async function (req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug })
      .populate("author")
      .populate({
        path: "likes",
        populate: { path: "owner" },
      })
      .populate({ path: "comments", populate: { path: "author" } });
    const foundLike = blog.likes.find(
      (like: any) =>
        like.owner._id.toString() === req.body.authenticatedUser?._id.toString()
    );
    res.locals.liked = foundLike ? true : false;
    res.status(200).json({ ok: true, message: "success", data: blog });
  } catch (err) {
    console.log("Error in blog: ", err);
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dushimimanafabricerwanda@gmail.com",
    pass: "zenz lbbo eorl gltg",
  },
});

const sendSubscriptionEmail = async (emails: string[]) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_EMAIL,
      to: `${emails.join(",")}`,
      subject: "A new article was added to the site",
      html: `<h3>Click this link to visit our site: https://fabrice-dush.github.io/My-Brand-Frontend/blogs.html</h3>`,
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

    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    blog.author = user;
    user.blogs.push(blog);
    const userBlogs = [...user.blogs];
    await blog.save();
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { blogs: userBlogs },
      { new: true, runValidators: true }
    );
    const blogs = await Blog.find();

    console.log("Created blog: ", blog);

    //? Sending email to subscribed users
    const subscribers = await Subscribe.find();
    const emails = subscribers.map((subscriber) => subscriber.email);
    await sendSubscriptionEmail(emails);
    res.status(201).json({ ok: true, message: "success", data: blogs });
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

    const updatedBlog = await Blog.findOneAndUpdate(
      { slug },
      {
        ...req.body,
        slug: req.body.title
          .replaceAll(/[*./:()?!\n]/g, "")
          .split(" ")
          .join("_")
          .toLowerCase(),
        image: imagePath,
      },
      { new: true, runValidators: true }
    );

    console.log("Updated blog: ", updatedBlog);

    const url = `https://my-brand-backend-n8rt.onrender.com/api/blogs/${updatedBlog.slug}`;
    res
      .status(200)
      .json({ ok: true, message: "success", data: updatedBlog, url });
  } catch (err) {
    console.error("Error updating a blog: ", err);
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};

export const deleteBlog = async function (req: Request, res: Response) {
  try {
    const { slug } = req.params;
    await Blog.findOneAndDelete({ slug });
    let blogs = await Blog.find();
    res.status(200).json({ ok: true, message: "success", data: blogs });
  } catch (err) {
    console.error("Error deleting a blog: ", err);
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};
