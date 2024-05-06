"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware/middleware");
const commentController_1 = require("../modules/comments/controllers/commentController");
const router = express_1.default.Router({ mergeParams: true });
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
router.delete("/:id", middleware_1.authenticate, middleware_1.isVerifiedFun, middleware_1.authorizeComment, commentController_1.deleteComment);
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
router.post("/", middleware_1.authenticate, middleware_1.isVerifiedFun, commentController_1.createComment);
exports.default = router;
