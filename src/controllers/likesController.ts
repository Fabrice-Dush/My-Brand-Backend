import { Request, Response } from "express";
import Blog from "../database/models/blogsModel";
import User from "../database/models/usersModel";
import Like from "../database/models/likesModel";

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
