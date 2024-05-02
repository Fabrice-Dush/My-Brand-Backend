"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware/middleware");
const contactController_1 = require("../modules/contacts/controllers/contactController");
const router = express_1.default.Router();
router
    .route("/")
    .post(contactController_1.createMessage)
    .get(middleware_1.authenticate, middleware_1.authorizeUsers, contactController_1.getMessages);
router.delete("/:id", middleware_1.authenticate, middleware_1.authorizeUsers, contactController_1.deleteMessage);
exports.default = router;
