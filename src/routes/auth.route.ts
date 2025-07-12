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
} from "../controllers";
import {
  completeAuthMiddleware,
  postAuthMiddleware,
  preAuthMiddleware,
} from "../middleware";

const authRouter: Router = express.Router();

authRouter.post(
  "/register",
  ...preAuthMiddleware.register,
  register,
  ...postAuthMiddleware.register,
  ...completeAuthMiddleware.register
);

authRouter.post(
  "/login",
  ...preAuthMiddleware.login,
  login,
  ...postAuthMiddleware.login,
  ...completeAuthMiddleware.login
);

authRouter.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  ...preAuthMiddleware.me,
  me,
  ...postAuthMiddleware.me
);

authRouter.post(
  "/logout",
  ...preAuthMiddleware.logout,
  logout,
  ...postAuthMiddleware.logout
);

authRouter.post(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  ...preAuthMiddleware.changePassword,
  changePassword,
  ...postAuthMiddleware.changePassword
);

authRouter.post(
  "/refresh-token",
  ...preAuthMiddleware.refreshToken,
  refreshToken,
  ...postAuthMiddleware.refreshToken
);

authRouter.get(
  "/status",
  passport.authenticate("jwt", { session: false }),
  ...preAuthMiddleware.status,
  checkAuthStatus,
  ...postAuthMiddleware.status
);

export { authRouter };
