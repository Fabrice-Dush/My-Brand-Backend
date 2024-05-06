import express from "express";

import { authenticate, authorizeUsers } from "../middleware/middleware";
import {
  createSubscribers,
  deleteSubscribers,
  getSubscribers,
} from "../modules/subscribers/controllers/subscriberController";
const router = express.Router();

// router
//   .route("/")
//   .get(authenticate, authorizeUsers, getSubscribers)
//   .post(createSubscribers);

/**
 * @swagger
 * tags:
 *   name: Subscribers
 *   description: Subscribers routes
 */

/**
 * @swagger
 * /subscribe:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all subscribers
 *     tags:
 *       - Subscribers
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get("/", authenticate, authorizeUsers, getSubscribers);

/**
 * @swagger
 * /subscribe:
 *   post:
 *     summary: create a new subscriber
 *     tags:
 *       - Subscribers
 *     requestBody:
 *       description: subscriber data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post("/", createSubscribers);

/**
 * @swagger
 * /subscribe/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a subscriber by ID
 *     tags:
 *       - Subscribers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: subscriber ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.delete("/:id", authenticate, authorizeUsers, deleteSubscribers);

export default router;
