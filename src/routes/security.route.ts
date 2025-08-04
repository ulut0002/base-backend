import express, { Router } from "express";
import passport from "passport";
import {
  getSessions,
  postDisable2FA,
  postEnable2FA,
  postLogoutOthers,
  postVerify2FA,
} from "../controllers";
import {
  postSecurityMiddleware,
  preSecurityMiddleware,
} from "../middleware/security.middleware";

const securityRouter: Router = express.Router();

securityRouter.use(passport.authenticate("jwt", { session: false }));

securityRouter.get(
  "/sessions",
  ...preSecurityMiddleware.getSessions,
  getSessions,
  ...postSecurityMiddleware.getSessions
);

securityRouter.post(
  "/logout-others",
  ...preSecurityMiddleware.postLogoutOthers,
  postLogoutOthers,
  ...postSecurityMiddleware.postLogoutOthers
);

export { securityRouter };
