"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const middleware_1 = require("../middleware/middleware");
const blogControllers_1 = require("../modules/blogs/controllers/blogControllers");
/**
 * @swagger
 * /:
 *  get:
 *      summary: This api endpoint is used to get all the blogs
 *      description: This api endpoint is used to get all the blogs
 *      responses:
 *          200:
 *              description: To test GET method

 */
// router.get("/", getBlogs);
router
    .route("/")
    .get(blogControllers_1.getBlogs)
    .post(blogControllers_1.uploadUserPhoto, middleware_1.authenticate, middleware_1.isVerifiedFun, blogControllers_1.createBlog);
router
    .route("/:slug")
    .get(blogControllers_1.getBlog)
    .put(blogControllers_1.uploadUserPhoto, middleware_1.authenticate, middleware_1.isVerifiedFun, middleware_1.authorizeBlog, blogControllers_1.updateBlog)
    .delete(middleware_1.authenticate, middleware_1.authorizeBlog, middleware_1.isVerifiedFun, blogControllers_1.deleteBlog);
exports.default = router;
