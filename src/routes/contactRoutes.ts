import express from "express";
import {
  getMessages,
  createMessage,
  deleteMessage,
} from "../controllers/contactsController";
import { authenticate, authorizeUsers } from "../middleware/middleware";
const router = express.Router();

router
  .route("/")
  .post(createMessage)
  .get(authenticate, authorizeUsers, getMessages);
router.delete("/:id", authenticate, authorizeUsers, deleteMessage);

export default router;
