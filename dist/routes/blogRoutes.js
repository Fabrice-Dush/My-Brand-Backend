"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const middleware_1 = require("../middleware/middleware");
const blogControllers_1 = require("../modules/blogs/controllers/blogControllers");
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
router.get("/", blogControllers_1.getBlogs);
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
router.post("/", blogControllers_1.uploadUserPhoto, middleware_1.authenticate, middleware_1.isVerifiedFun, blogControllers_1.createBlog);
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
router.get("/:slug", blogControllers_1.getBlog);
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
router.put("/:slug", blogControllers_1.uploadUserPhoto, middleware_1.authenticate, middleware_1.isVerifiedFun, middleware_1.authorizeBlog, blogControllers_1.updateBlog);
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
router.delete("/:slug", middleware_1.authenticate, middleware_1.authorizeBlog, middleware_1.isVerifiedFun, blogControllers_1.deleteBlog);
exports.default = router;
