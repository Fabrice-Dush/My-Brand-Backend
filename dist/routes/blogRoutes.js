"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogsController_1 = require("../controllers/blogsController");
const middleware_1 = require("../middleware/middleware");
const router = express_1.default.Router();
const cloudinary_1 = __importDefault(require("cloudinary"));
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
const passCloudinary = cloudinary_1.default.v2;
// import multer from "multer";
// const upload = multer({ dest: "uploads/" });
// const cloudinary2 = cloudinary.v2();
router.route("/").get(middleware_1.checkUser, blogsController_1.getBlogs).post(middleware_1.authenticate, blogsController_1.createBlog);
// .post(upload.single("image"), function (req: Request, res: Response) {
//   console.log("Request body: ", req.body);
//   console.log("File: ", req.files);
//   res.status(200).json({ ok: true, message: "success", data: req.body });
// });
router.get("/new", middleware_1.authenticate, blogsController_1.createBlogForm);
router
    .route("/:slug")
    .get(blogsController_1.getBlog)
    .put(middleware_1.authenticate, middleware_1.authorizeBlog, blogsController_1.updateBlog)
    .delete(middleware_1.authenticate, middleware_1.authorizeBlog, blogsController_1.deleteBlog);
router.delete("/:slug/comments/:id", middleware_1.authenticate, middleware_1.authorizeComment, blogsController_1.deleteComment);
router.get("/:slug/edit", middleware_1.authenticate, middleware_1.authorizeBlog, blogsController_1.updateBlogForm);
router.post("/:slug/comments", middleware_1.authenticate, blogsController_1.createComment);
router.post("/:slug/likes", middleware_1.authenticate, blogsController_1.createLike);
exports.default = router;
