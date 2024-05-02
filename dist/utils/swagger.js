"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// import log from "logeer";
const options = {
    apis: ["./../routes/*.ts"],
    definition: {
        openapi: "3.0.0",
        info: {
            title: "REST API Docs",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:8000/",
            },
        ],
        // components: {
        //   securitySchemas: {
        //     bearerAuth: {
        //       type: "http",
        //       scheme: "bearer",
        //       bearerFormat: "JWT",
        //     },
        //   },
        // },
        // security: [
        //   {
        //     bearerAuth: [],
        //   },
        // ],
    },
    // apis: ["./../routes/*.ts", "./../database/models/*.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerDocs(app, port) {
    //? swagger page
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    //? Docs in JSON format
    // app.get("docs.json", (req: Request, res: Response) => {
    //   res.setHeader("Content-Type", "application/json");
    //   res.send(swaggerSpec);
    // });
    console.log(`Docs available at http://localhost:${port}/api-docs`);
}
exports.default = swaggerDocs;
