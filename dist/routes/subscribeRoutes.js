"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscribeController_1 = require("../controllers/subscribeController");
const middleware_1 = require("../middleware/middleware");
const router = express_1.default.Router();
router
    .route("/")
    .get(middleware_1.authenticate, middleware_1.authorizeUsers, subscribeController_1.getSubscribers)
    .post(subscribeController_1.createSubscribers);
router.delete("/:id", middleware_1.authenticate, middleware_1.authorizeUsers, subscribeController_1.deleteSubscribers);
exports.default = router;
