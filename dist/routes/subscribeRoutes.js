"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware/middleware");
const subscriberController_1 = require("../modules/subscribers/controllers/subscriberController");
const router = express_1.default.Router();
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
router.get("/", middleware_1.authenticate, middleware_1.authorizeUsers, subscriberController_1.getSubscribers);
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
router.post("/", subscriberController_1.createSubscribers);
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
router.delete("/:id", middleware_1.authenticate, middleware_1.authorizeUsers, subscriberController_1.deleteSubscribers);
exports.default = router;
