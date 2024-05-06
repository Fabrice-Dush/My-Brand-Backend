import express from "express";

import { authenticate, authorizeUsers } from "../middleware/middleware";
import {
  createMessage,
  deleteMessage,
  getMessages,
} from "../modules/contacts/controllers/contactController";
const router = express.Router();

// router
//   .route("/")
//   .post(createMessage)
//   .get(authenticate, authorizeUsers, getMessages);

// router.post("/", createMessage);

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact routes
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Create a new message
 *     tags:
 *       - Contact
 *     requestBody:
 *       description: message data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post("/", createMessage);

// router.get("/contact", authenticate, authorizeUsers, getMessages);
/**
 * @swagger
 * /contact:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all messages
 *     tags:
 *       - Contact
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get("/", authenticate, authorizeUsers, getMessages);

/**
 * @swagger
 * /contact/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a message by ID
 *     tags:
 *       - Contact
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: message ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.delete("/:id", authenticate, authorizeUsers, deleteMessage);

export default router;
