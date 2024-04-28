import { Request, Response } from "express";
import Blog from "../database/models/blogsModel";
import User from "../database/models/usersModel";
import Comment from "../database/models/commentsModel";
import Like from "../database/models/likesModel";
import nodemailer from "nodemailer";

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
    console.log(slug);
    const blog = await Blog.findOne({ slug })
      .populate("author")
      .populate({
        path: "likes",
        populate: { path: "owner" },
      })
      .populate({ path: "comments", populate: { path: "author" } });
    console.log(blog);
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

export const createBlogForm = function (req: Request, res: Response) {
  try {
    res.render("new");
  } catch (err) {
    res.redirect("/blogs");
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "stmp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

// const sendSubscriptionEmail = async (email: string, blog) => {
//   try {
//     const mailOptions = {
//       from: process.env.MAIL_EMAIL,
//       to: email,
//       subject: "A new article was added to the site",
//       text: `Visit our wesbite to learn more: http://127.0.0.1:5500/blogs`,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log("Subscription email sent successfully");
//   } catch (error) {
//     console.error("Error sending subscription email:", error);
//   }
// };

export const createBlog = async function (req: Request, res: Response) {
  try {
    const { id } = req.body.authenticatedUser;
    const blog: any = new Blog({
      ...req.body,
      slug: req.body.title
        .replaceAll(/[*./:()?\n]/g, "")
        .split(" ")
        .join("_")
        .toLowerCase(),
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

    //? Sending email to subscribed users
    // const subscribers = await Subscribe.find();
    // subscribers.forEach((subscriber) =>
    //   sendSubscriptionEmail(subscriber.email, blog)
    // );

    res.status(201).json({ ok: true, message: "success", data: blogs });
  } catch (err) {
    console.log("Error creating a new blog");
    console.log(err);
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};

export const createComment = async function (req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });
    const newComment: any = new Comment({ text: req.body.comment });
    newComment.author = req.body.authenticatedUser;
    blog.comments.push(newComment);
    await newComment.save();
    await blog.save();

    const foundBlog = await Blog.findById(blog.id)
      .populate("author")
      .populate({ path: "comments", populate: { path: "author" } })
      .populate({ path: "likes", populate: { path: "owner" } });

    console.log("Blog: ", foundBlog);

    res.status(201).json({ ok: true, message: "success", data: foundBlog });
  } catch (err) {
    console.log("Error creating comment: ", err);
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};

export const deleteComment = async function (req: Request, res: Response) {
  try {
    const { slug, id } = req.params;
    const updatedBlog = await Blog.findOneAndUpdate(
      { slug },
      { $pull: { comments: id } },
      { new: true, runValidators: true }
    );
    const deletedComment = await Comment.findByIdAndDelete(id);

    const foundBlog = await Blog.findById(updatedBlog.id)
      .populate("author")
      .populate({ path: "comments", populate: { path: "author" } })
      .populate({ path: "likes", populate: { path: "owner" } });

    res.status(200).json({ ok: true, message: "success", data: foundBlog });
  } catch (err) {
    console.log("Error deleting comment: ", err);
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};

export const createLike = async function (req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug }).populate({
      path: "likes",
      populate: { path: "owner" },
    });

    const foundLike = blog.likes.find(
      (like: any) =>
        like.owner._id.toString() === req.body.authenticatedUser._id.toString()
    );

    let actualBlog;

    if (foundLike) {
      actualBlog = await Blog.findByIdAndUpdate(
        blog.id,
        { $pull: { likes: foundLike.id } },
        { new: true, runValidators: true }
      );
      const deletedLike = await Like.findByIdAndDelete(foundLike.id);
    } else {
      const like: any = new Like({ likeCount: 1 });
      like.owner = req.body.authenticatedUser;
      like.blog = blog;
      blog.likes.push(like);
      await like.save();
      await blog.save();
      actualBlog = blog;
    }

    const realBlog = await Blog.findById(actualBlog.id)
      .populate("author")
      .populate({ path: "comments", populate: { path: "author" } })
      .populate({ path: "likes", populate: { path: "owner" } });

    console.log(realBlog);

    res.status(201).json({ ok: true, message: "success", data: realBlog });
  } catch (err) {
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};

export const updateBlogForm = async function (req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });

    res.render("edit", { blog });
  } catch (err) {
    console.log("Error getting something: ", err);
    res.redirect(`/blogs/${req.params.slug}`);
  }
};

export const updateBlog = async function (req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const updatedBlog = await Blog.findOneAndUpdate(
      { slug },
      {
        ...req.body,
        slug: req.body.title
          .replaceAll(/[*./:()?!\n]/g, "")
          .split(" ")
          .join("_")
          .toLowerCase(),
      },
      { new: true, runValidators: true }
    );
    const url = `http://localhost:8000/blogs/${updatedBlog.slug}`;
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
    console.log("Reached here");
    const { slug } = req.params;
    await Blog.findOneAndDelete({ slug });
    let blogs = await Blog.find();
    res.status(200).json({ ok: true, message: "success", data: blogs });
  } catch (err) {
    console.error("Error deleting a blog: ", err);
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};
