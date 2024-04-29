import express from "express";
import {
  deleteComment,
  createComment,
} from "./../controllers/commentsControllers";

import { authenticate, authorizeComment } from "../middleware/middleware";

const router = express.Router({ mergeParams: true });

router.delete("/:id", authenticate, authorizeComment, deleteComment);

router.post("/", authenticate, createComment);

export default router;
