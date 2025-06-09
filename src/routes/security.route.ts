import express, { Router } from "express";
import passport from "passport";
import {
  getSessions,
  postDisable2FA,
  postEnable2FA,
  postLogoutOthers,
  postVerify2FA,
} from "../controllers";

const securityRouter: Router = express.Router();

securityRouter.use(passport.authenticate("jwt", { session: false }));

securityRouter.get("/sessions", getSessions);
securityRouter.post("/logout-others", postLogoutOthers);
securityRouter.post("/enable-2fa", postEnable2FA);
securityRouter.post("/disable-2fa", postDisable2FA);
securityRouter.post("/verify-2fa", postVerify2FA);

export { securityRouter };
