"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware/middleware");
const userController_1 = require("../modules/users/controllers/userController");
const router = express_1.default.Router();
router.route("/verify").get(userController_1.verifyAccount);
router.route("/login").post(userController_1.login);
router.route("/signup").post(userController_1.signup);
router.route("/users").get(middleware_1.authenticate, middleware_1.authorizeUsers, userController_1.getUsers);
router.delete("/users/:id", middleware_1.authenticate, middleware_1.authorizeUsers, userController_1.deleteUser);
exports.default = router;
