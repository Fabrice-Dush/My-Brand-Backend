import { Express, Request, Response } from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { version } from "../../package.json";
// import log from "logeer";

const options: swaggerJsDoc.Options = {
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

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app: Express, port: number) {
  //? swagger page
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  //? Docs in JSON format
  // app.get("docs.json", (req: Request, res: Response) => {
  //   res.setHeader("Content-Type", "application/json");
  //   res.send(swaggerSpec);
  // });

  console.log(`Docs available at http://localhost:${port}/api-docs`);
}

export default swaggerDocs;
