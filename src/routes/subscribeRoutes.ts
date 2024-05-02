import express from "express";

import { authenticate, authorizeUsers } from "../middleware/middleware";
import { createSubscribers, deleteSubscribers, getSubscribers } from "../modules/subscribers/controllers/subscriberController";
const router = express.Router();

router
  .route("/")
  .get(authenticate, authorizeUsers, getSubscribers)
  .post(createSubscribers);

router.delete("/:id", authenticate, authorizeUsers, deleteSubscribers);

export default router;
