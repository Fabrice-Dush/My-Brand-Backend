"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentsControllers_1 = require("./../controllers/commentsControllers");
const middleware_1 = require("../middleware/middleware");
const router = express_1.default.Router({ mergeParams: true });
router.delete("/:id", middleware_1.authenticate, middleware_1.authorizeComment, commentsControllers_1.deleteComment);
router.post("/", middleware_1.authenticate, commentsControllers_1.createComment);
exports.default = router;
