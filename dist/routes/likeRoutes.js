"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router({ mergeParams: true });
const middleware_1 = require("../middleware/middleware");
const likeController_1 = require("../modules/likes/controllers/likeController");
router.post("/", middleware_1.authenticate, middleware_1.isVerifiedFun, likeController_1.createLike);
exports.default = router;
