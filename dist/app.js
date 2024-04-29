"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const method_override_1 = __importDefault(require("method-override"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// import swaggerJsDoc from "swagger-jsdoc";
// import swaggerUI from "swagger-ui-express";
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const subscribeRoutes_1 = __importDefault(require("./routes/subscribeRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const likeRoutes_1 = __importDefault(require("./routes/likeRoutes"));
const app = (0, express_1.default)();
// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Node Js Project for mongodb",
//       version: "1.0.0",
//     },
//     servers: [
//       {
//         api: "http://localhost:8000",
//       },
//     ],
//   },
//   apis: ["./mongodb.js"],
// };
dotenv_1.default.config();
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(process.env.DATABASE);
            console.log("Connected to database");
        }
        catch (err) {
            console.log("ERROR CONNECTING TO DATABASE");
            console.log(err);
        }
    });
})();
app.use((0, cors_1.default)());
app.use((0, method_override_1.default)("_method"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, connect_flash_1.default)());
app.use("/api/", userRoutes_1.default);
app.use("/api/contact", contactRoutes_1.default);
app.use("/api/blogs", blogRoutes_1.default);
app.use("/api/blogs/:slug/comments", commentRoutes_1.default);
app.use("/api/subscribe", subscribeRoutes_1.default);
app.use("/api/blogs/:slug/likes", likeRoutes_1.default);
//? Global error handling middleware
app.use(function (err, req, res, next) {
    // res.status(500).json({mess})
});
app.listen(process.env.PORT, () => console.log(`Server started listening on port ${process.env.PORT}`));
