import express from "express";
const router = express.Router();

import {
  authenticate,
  authorizeBlog,
  isVerifiedFun,
} from "../middleware/middleware";
import {
  createBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  updateBlog,
  uploadUserPhoto,
} from "../modules/blogs/controllers/blogControllers";

/**
 * @swagger
 * /:
 *  get:
 *      summary: This api endpoint is used to get all the blogs
 *      description: This api endpoint is used to get all the blogs
 *      responses:
 *          200:
 *              description: To test GET method

 */
// router.get("/", getBlogs);
router
  .route("/")
  .get(getBlogs)
  .post(uploadUserPhoto, authenticate, isVerifiedFun, createBlog);

router
  .route("/:slug")
  .get(getBlog)
  .put(uploadUserPhoto, authenticate, isVerifiedFun, authorizeBlog, updateBlog)
  .delete(authenticate, authorizeBlog, isVerifiedFun, deleteBlog);

export default router;
