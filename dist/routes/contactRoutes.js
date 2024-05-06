"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware/middleware");
const contactController_1 = require("../modules/contacts/controllers/contactController");
const router = express_1.default.Router();
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
router.post("/", contactController_1.createMessage);
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
router.get("/", middleware_1.authenticate, middleware_1.authorizeUsers, contactController_1.getMessages);
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
router.delete("/:id", middleware_1.authenticate, middleware_1.authorizeUsers, contactController_1.deleteMessage);
exports.default = router;
