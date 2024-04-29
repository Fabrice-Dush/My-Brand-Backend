import express from "express";
const router = express.Router({ mergeParams: true });
import { authenticate } from "../middleware/middleware";
import { createLike } from "./../controllers/likesController";
router.post("/", authenticate, createLike);

export default router;
