import express from "express";

import {
  authenticate,
  authorizeComment,
  isVerifiedFun,
} from "../middleware/middleware";
import {
  createComment,
  deleteComment,
} from "../modules/comments/controllers/commentController";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comments routes
 */

/**
 * @swagger
 * /blogs/{slug}/comments/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a comment by ID
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog Slug
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.delete(
  "/:id",
  authenticate,
  isVerifiedFun,
  authorizeComment,
  deleteComment
);

/**
 * @swagger
 * /blogs/{slug}/comments:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a comment on a blog
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: User slug
 *     requestBody:
 *       description: comment data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post("/", authenticate, isVerifiedFun, createComment);

export default router;
