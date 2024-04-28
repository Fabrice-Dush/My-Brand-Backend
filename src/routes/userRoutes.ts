import express from "express";
import {
  login,
  signup,
  logout,
  getUsers,
  deleteUser,
} from "../controllers/usersController";
import { authenticate, authorizeUsers } from "../middleware/middleware";
const router = express.Router();

router.route("/login").post(login);
router.route("/signup").post(signup);
router.get("/logout", logout);

router.route("/users").get(authenticate, authorizeUsers, getUsers);

router.delete("/users/:id", authenticate, authorizeUsers, deleteUser);

export default router;
