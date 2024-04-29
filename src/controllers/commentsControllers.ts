import { Request, Response } from "express";
import Blog from "../database/models/blogsModel";
import User from "../database/models/usersModel";
import Comment from "../database/models/commentsModel";

export const createComment = async function (req: Request, res: Response) {
  try {
    console.log("Reaching this far");
    const { slug } = req.params;
    console.log(req.params);
    const blog = await Blog.findOne({ slug });
    console.log("Blog: ", blog);
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
