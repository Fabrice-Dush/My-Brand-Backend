import express from "express";
const router = express.Router();

import {
  authenticate,
  authorizeBlog,
  isVerifiedFun,
} from "../middleware/middleware";
import {
  approveBlog,
  createBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  updateBlog,
  uploadUserPhoto,
} from "../modules/blogs/controllers/blogControllers";

// router
//   .route("/")
//   .get(getBlogs)
//   .post(uploadUserPhoto, authenticate, isVerifiedFun, createBlog);

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blogs routes
 */

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get a list of all blogs
 *     tags:
 *       - Blogs
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All blogs successfully found
 *
 *
 */
router.get("/", getBlogs);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: apiKey
 *       name: authorization
 *       in: header
 */

/**
 * @swagger
 * /blogs:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new blog
 *     tags:
 *       - Blogs
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               longDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post("/", uploadUserPhoto, authenticate, isVerifiedFun, createBlog);

// router.post("/post", uploadUserPhoto, authenticate, isVerifiedFun, createBlog);

router;
// .route("/:slug")
// .get(getBlog)
// .put(uploadUserPhoto, authenticate, isVerifiedFun, authorizeBlog, updateBlog)
// .delete(authenticate, authorizeBlog, isVerifiedFun, deleteBlog);

/**
 * @swagger
 * /blogs/{slug}:
 *   get:
 *     summary: Get a blog by slug
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog slug
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get("/:slug", getBlog);

/**
 * @swagger
 * /blogs/{slug}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a blog by slug
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog slug
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.put("/:slug", uploadUserPhoto, authenticate, updateBlog);

router.patch("/:slug", authenticate, isVerifiedFun, approveBlog);

/**
 * @swagger
 * /blogs/{slug}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a blog by slug
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog slug
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.delete("/:slug", authenticate, authorizeBlog, isVerifiedFun, deleteBlog);

export default router;
