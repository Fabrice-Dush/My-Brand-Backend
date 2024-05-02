import express from "express";
const router = express.Router();

import userRoutes from "./userRoutes";
import contactRoutes from "./contactRoutes";
import blogRoutes from "./blogRoutes";
import commentRoutes from "./commentRoutes";
import subscribeRoutes from "./subscribeRoutes";
import likeRoutes from "./likeRoutes";

router.use("/", userRoutes);
router.use("/contact", contactRoutes);
router.use("/blogs", blogRoutes);
router.use("/blogs/:slug/comments", commentRoutes);
router.use("/subscribe", subscribeRoutes);
router.use("/blogs/:slug/likes", likeRoutes);

export default router;
