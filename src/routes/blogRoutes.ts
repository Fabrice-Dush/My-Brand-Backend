import express from "express";

import {
  getBlog,
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadUserPhoto,
} from "../controllers/blogsController";
import { authenticate, authorizeBlog } from "../middleware/middleware";

const router = express.Router();

router.route("/").get(getBlogs).post(uploadUserPhoto, authenticate, createBlog);

router
  .route("/:slug")
  .get(getBlog)
  .put(uploadUserPhoto, authenticate, authorizeBlog, updateBlog)
  .delete(authenticate, authorizeBlog, deleteBlog);

export default router;
