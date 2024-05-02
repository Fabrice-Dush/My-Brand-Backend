import express from "express";

import { authenticate, authorizeUsers } from "../middleware/middleware";
import {
  createMessage,
  deleteMessage,
  getMessages,
} from "../modules/contacts/controllers/contactController";
const router = express.Router();

router
  .route("/")
  .post(createMessage)
  .get(authenticate, authorizeUsers, getMessages);
router.delete("/:id", authenticate, authorizeUsers, deleteMessage);

export default router;
