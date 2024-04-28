import express, { Request, Response } from "express";
import {
  getBlog,
  getBlogs,
  createBlogForm,
  createBlog,
  createComment,
  createLike,
  updateBlog,
  deleteBlog,
  updateBlogForm,
  deleteComment,
} from "../controllers/blogsController";
import {
  authenticate,
  authorizeBlog,
  authorizeComment,
  checkUser,
} from "../middleware/middleware";
const router = express.Router();
import cloudinary from "cloudinary";

import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const passCloudinary = cloudinary.v2;

// import multer from "multer";
// const upload = multer({ dest: "uploads/" });
// const cloudinary2 = cloudinary.v2();

router.route("/").get(checkUser, getBlogs).post(authenticate, createBlog);
// .post(upload.single("image"), function (req: Request, res: Response) {
//   console.log("Request body: ", req.body);
//   console.log("File: ", req.files);
//   res.status(200).json({ ok: true, message: "success", data: req.body });
// });
router.get("/new", authenticate, createBlogForm);

router
  .route("/:slug")
  .get(getBlog)
  .put(authenticate, authorizeBlog, updateBlog)
  .delete(authenticate, authorizeBlog, deleteBlog);
router.delete(
  "/:slug/comments/:id",
  authenticate,
  authorizeComment,
  deleteComment
);
router.get("/:slug/edit", authenticate, authorizeBlog, updateBlogForm);

router.post("/:slug/comments", authenticate, createComment);
router.post("/:slug/likes", authenticate, createLike);
export default router;
