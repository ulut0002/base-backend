// src/routes/auth.ts

import express, { Router } from "express";
import passport from "passport";
import {
  login,
  logout,
  me,
  register,
  changePassword,
  checkAuthStatus,
  refreshToken,
  loginSuccess,
} from "../controllers";
import { postAuthMiddleware, preAuthMiddleware } from "../middleware";

const authRouter: Router = express.Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT issued as HttpOnly cookie
 */
authRouter.post(
  "/login",
  ...preAuthMiddleware.login,
  login,
  ...postAuthMiddleware.login,
  loginSuccess
);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created and JWT issued
 */
authRouter.post(
  "/register",
  ...preAuthMiddleware.register,
  register,
  ...postAuthMiddleware.register
);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 */
authRouter.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  ...preAuthMiddleware.me,
  me,
  ...postAuthMiddleware.me
);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logs the user out
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: JWT cookie cleared
 */
authRouter.post(
  "/logout",
  ...preAuthMiddleware.logout,
  logout,
  ...postAuthMiddleware.logout
);

/**
 * @openapi
 * /auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
authRouter.post(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  ...preAuthMiddleware.changePassword,
  changePassword,
  ...postAuthMiddleware.changePassword
);

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New JWT issued
 */
authRouter.post(
  "/refresh-token",
  ...preAuthMiddleware.refreshToken,
  refreshToken,
  ...postAuthMiddleware.refreshToken
);

/**
 * @openapi
 * /auth/status:
 *   get:
 *     summary: Check current authentication status
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user session info
 */
authRouter.get(
  "/status",
  passport.authenticate("jwt", { session: false }),
  ...preAuthMiddleware.status,
  checkAuthStatus,
  ...postAuthMiddleware.status
);

export { authRouter };
