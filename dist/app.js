"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const method_override_1 = __importDefault(require("method-override"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const swagger_1 = __importDefault(require("./utils/swagger"));
const allRoutes_1 = __importDefault(require("./routes/allRoutes"));
const app = (0, express_1.default)();
dotenv_1.default.config();
require("./database/config/database");
app.use((0, cors_1.default)());
app.use((0, method_override_1.default)("_method"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, connect_flash_1.default)());
app.use("/api", allRoutes_1.default);
//? Global error handling middleware
app.use(function (err, req, res, next) {
    // res.status(500).json({mess})
});
app.listen(process.env.PORT, () => {
    console.log(`Server started listening on port ${process.env.PORT}`);
    (0, swagger_1.default)(app, +process.env.PORT);
});
