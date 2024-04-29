"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogsController_1 = require("../controllers/blogsController");
const middleware_1 = require("../middleware/middleware");
const router = express_1.default.Router();
router.route("/").get(blogsController_1.getBlogs).post(blogsController_1.uploadUserPhoto, middleware_1.authenticate, blogsController_1.createBlog);
router
    .route("/:slug")
    .get(blogsController_1.getBlog)
    .put(blogsController_1.uploadUserPhoto, middleware_1.authenticate, middleware_1.authorizeBlog, blogsController_1.updateBlog)
    .delete(middleware_1.authenticate, middleware_1.authorizeBlog, blogsController_1.deleteBlog);
exports.default = router;
