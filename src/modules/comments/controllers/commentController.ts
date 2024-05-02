import { Request, Response } from "express";
import Comment from "./../../../database/models/commentsModel";
import {
  getBlogById,
  getOneBlog,
  updateBlogBySlug,
} from "../../blogs/repository/blogRepository";
import { deleteCommentById } from "../repository/commentRepository";

export const createComment = async function (req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const blog = await getOneBlog(slug);

    const newComment: any = new Comment({ text: req.body.comment });
    newComment.author = req.body.authenticatedUser;

    blog.comments.push(newComment);

    await newComment.save();
    await blog.save();

    const foundBlog = await getBlogById(blog.id);

    res.status(201).json({ ok: true, message: "success", data: foundBlog });
  } catch (err) {
    console.log("Error creating comment: ", err);
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};

export const deleteComment = async function (req: Request, res: Response) {
  try {
    const { slug, id } = req.params;
    const updatedBlog = await updateBlogBySlug(slug, id);

    await deleteCommentById(id);

    const foundBlog = await getBlogById(updatedBlog.id);

    res.status(200).json({ ok: true, message: "success", data: foundBlog });
  } catch (err) {
    console.log("Error deleting comment: ", err);
    res.status(500).json({ ok: false, message: "fail", errors: err });
  }
};
