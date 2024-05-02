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

export const getBlogs = async function (req: Request, res: Response) {
  try {
    const blogs = await getAllBlogs();
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
    blog.author = user;
    user.blogs.push(blog);
    const userBlogs = [...user.blogs];
    await blog.save();
    await updateOneuser(user.id, userBlogs);
    const blogs = await getAllBlogs();

    //? Sending email to subscribed users
    const subscribers = await Subscribe.find();
    const emails = subscribers.map((subscriber) => subscriber.email);
    await sendSubscriptionEmail(emails, blog.slug);
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

    const updatedBlog = await updateOneBlog(slug, req.body, imagePath);

    //  const url = `https://my-brand-backend-n8rt.onrender.com/api/blogs/${updatedBlog.slug}`;
    const url = `http://localhost:8000/api/blogs/${updatedBlog.slug}`;
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
    await deleteOneBlog(slug);
    let blogs = await getAllBlogs();
    res.status(200).json({ ok: true, message: "success", data: blogs });
  } catch (err) {
    console.error("Error deleting a blog: ", err);
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};
