import express from "express";

import { authenticate, authorizeUsers } from "../middleware/middleware";
import {
  deleteUser,
  getUsers,
  login,
  signup,
  verifyAccount,
} from "../modules/users/controllers/userController";
const router = express.Router();

router.route("/verify").get(verifyAccount);

router.route("/login").post(login);
router.route("/signup").post(signup);

router.route("/users").get(authenticate, authorizeUsers, getUsers);

router.delete("/users/:id", authenticate, authorizeUsers, deleteUser);

export default router;
