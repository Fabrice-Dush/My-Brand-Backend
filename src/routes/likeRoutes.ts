import express from "express";
const router = express.Router({ mergeParams: true });
import { authenticate, isVerifiedFun } from "../middleware/middleware";
import { createLike } from "../modules/likes/controllers/likeController";
router.post("/", authenticate, isVerifiedFun, createLike);

export default router;
