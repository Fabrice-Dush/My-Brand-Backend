"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactsController_1 = require("../controllers/contactsController");
const middleware_1 = require("../middleware/middleware");
const router = express_1.default.Router();
router
    .route("/")
    .post(contactsController_1.createMessage)
    .get(middleware_1.authenticate, middleware_1.authorizeUsers, contactsController_1.getMessages);
router.delete("/:id", middleware_1.authenticate, middleware_1.authorizeUsers, contactsController_1.deleteMessage);
exports.default = router;
