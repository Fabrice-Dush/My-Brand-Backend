import express from "express";
import {
  createSubscribers,
  deleteSubscribers,
  getSubscribers,
} from "../controllers/subscribeController";
import { authenticate, authorizeUsers } from "../middleware/middleware";
const router = express.Router();

router
  .route("/")
  .get(authenticate, authorizeUsers, getSubscribers)
  .post(createSubscribers);

router.delete("/:id", authenticate, authorizeUsers, deleteSubscribers);

export default router;
