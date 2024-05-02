"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware/middleware");
const commentController_1 = require("../modules/comments/controllers/commentController");
const router = express_1.default.Router({ mergeParams: true });
router.delete("/:id", middleware_1.authenticate, middleware_1.isVerifiedFun, middleware_1.authorizeComment, commentController_1.deleteComment);
router.post("/", middleware_1.authenticate, middleware_1.isVerifiedFun, commentController_1.createComment);
exports.default = router;
