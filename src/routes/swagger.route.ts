import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Router } from "express";
import { getBackendUrl } from "../lib";

// -------------------------
// Swagger API Documentation Middleware
// -------------------------
//
// This middleware generates OpenAPI 3.0 documentation using `swagger-jsdoc`
// and serves it with `swagger-ui-express` at the `/docs` route.
//
// Requirements:
//   - Annotate your route handlers with JSDoc using the @openapi tag.
//   - Routes must reside in files matched by the `apis` glob pattern below.
//
// Example:
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 */

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API",
      version: "1.0.0",
      description: "Auto-generated Swagger docs from JSDoc comments.",
    },
    servers: [
      {
        url: getBackendUrl(), // Or dynamically from getBackendUrl()
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/**/*.ts"], // Recursive path for routes
});

const swaggerRoute = Router();
swaggerRoute.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export { swaggerRoute };
