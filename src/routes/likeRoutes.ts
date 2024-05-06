import express from "express";
const router = express.Router({ mergeParams: true });
import { authenticate, isVerifiedFun } from "../middleware/middleware";
import { createLike } from "../modules/likes/controllers/likeController";

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Likes routes
 */

/**
 * @swagger
 * /blogs/{slug}/likes:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a like on a blog
 *     tags:
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog slug
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post("/", authenticate, isVerifiedFun, createLike);

export default router;
