"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("../controllers/usersController");
const middleware_1 = require("../middleware/middleware");
const router = express_1.default.Router();
router.route("/login").post(usersController_1.login);
router.route("/signup").post(usersController_1.signup);
router.get("/logout", usersController_1.logout);
router.route("/users").get(middleware_1.authenticate, middleware_1.authorizeUsers, usersController_1.getUsers);
router.delete("/users/:id", middleware_1.authenticate, middleware_1.authorizeUsers, usersController_1.deleteUser);
exports.default = router;
