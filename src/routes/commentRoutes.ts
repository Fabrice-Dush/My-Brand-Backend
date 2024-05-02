import express from "express";

import {
  authenticate,
  authorizeComment,
  isVerifiedFun,
} from "../middleware/middleware";
import {
  createComment,
  deleteComment,
} from "../modules/comments/controllers/commentController";

const router = express.Router({ mergeParams: true });

router.delete("/:id", authenticate, isVerifiedFun, authorizeComment, deleteComment);

router.post("/", authenticate, isVerifiedFun, createComment);

export default router;
