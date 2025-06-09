// --- routes/recovery.routes.ts ---

import express, { Router } from "express";
import passport from "passport";
import {
  postForgotPassword,
  postResendVerification,
  postResetPassword,
  postSendVerification,
  postVerifyAccount,
  postRequestPasswordReset,
} from "../controllers";

const recoveryRouter: Router = express.Router();

recoveryRouter.post("/request-password-reset", postRequestPasswordReset);

recoveryRouter.post("/reset-password", postResetPassword);

recoveryRouter.post(
  "/send-verification",
  passport.authenticate("jwt", { session: false }),
  postSendVerification
);

recoveryRouter.post("/verify-account", postVerifyAccount);

recoveryRouter.post("/resend-verification", postResendVerification);

export { recoveryRouter };
