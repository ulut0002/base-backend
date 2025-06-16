// --- routes/recovery.routes.ts ---

import express, { Router } from "express";
import passport from "passport";
import {
  postResendVerification,
  postResetPassword,
  postSendVerification,
  postVerifyAccount,
  postRequestPasswordReset,
} from "../controllers";

const recoveryRouter: Router = express.Router();

/**
 * @openapi
 * /recovery/request-password-reset:
 *   post:
 *     summary: Request a password reset link
 *     tags: [Recovery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset link sent
 */
recoveryRouter.post("/request-password-reset", postRequestPasswordReset);

/**
 * @openapi
 * /recovery/reset-password:
 *   post:
 *     summary: Reset user password using token
 *     tags: [Recovery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password has been reset
 */
recoveryRouter.post("/reset-password", postResetPassword);

/**
 * @openapi
 * /recovery/send-verification:
 *   post:
 *     summary: Send email verification link to authenticated user
 *     tags: [Recovery]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification email sent
 */
recoveryRouter.post("/send-verification", postSendVerification);

/**
 * @openapi
 * /recovery/verify-account:
 *   post:
 *     summary: Verify user account using token
 *     tags: [Recovery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account successfully verified
 */
recoveryRouter.post("/verify-account", postVerifyAccount);

/**
 * @openapi
 * /recovery/resend-verification:
 *   post:
 *     summary: Resend account verification email
 *     tags: [Recovery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification email resent
 */
recoveryRouter.post("/resend-verification", postResendVerification);

export { recoveryRouter };
